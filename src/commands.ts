interface Model {
    id: string;
}

interface User extends Model {
    email: string;
}

type LaravelCypressRequestOptions = Omit<Cypress.RequestOptions, 'url'>;

const customCommands = {

    laravelCypressRequest(path: string, options: Partial<LaravelCypressRequestOptions> = {}): Cypress.Chainable<Cypress.Response> {
        const laravelUrl = Cypress.env('LARAVEL_URL') ?? Cypress.env('laravelUrl') ?? '';

        return cy.request({
            url: `${laravelUrl}/_cypress/${path}`,
            ...options,
        });
    },

    setup(): void {
        Cypress.log({ name: 'setup' });

        cy.laravelCypressRequest('setup', { log: false });
    },

    csrfToken(): Cypress.Chainable<string> {
        return cy
            .laravelCypressRequest('csrf_token', { log: false })
            .its('body', { log: false });
    },

    currentUser<U extends User = any>(guard?: string): Cypress.Chainable<U> {
        guard = guard || '';

        return cy
            .laravelCypressRequest(`current_user/${guard}`, { log: false })
            .its('body', { log: false });
    },

    create<M extends Model = any>(
        model: string,
        quantityOrAttributes?: number | any,
        attributes?: any,
    ): Cypress.Chainable<M> {
        let quantity;

        if (typeof quantityOrAttributes === 'object')
            attributes = quantityOrAttributes;
        else if (typeof quantityOrAttributes === 'number')
            quantity = quantityOrAttributes;

        return cy
            .csrfToken()
            .then(
                csrfToken => cy
                    .laravelCypressRequest('create_models', {
                        method: 'POST',
                        body: {
                            _token: csrfToken,
                            modelClass: model,
                            quantity,
                            attributes,
                        },
                        log: false,
                    })
                    .its('body', { log: false }),
            )
            .then(result => {
                Cypress.log({
                    name: 'create',
                    message: [model, quantity, attributes],
                    consoleProps: () => ({
                        model,
                        quantity,
                        attributes,
                        yielded: result,
                    }),
                });

                return result;
            });
    },

    login<U extends User = any>(userId?: number, guard?: string): Cypress.Chainable<U> {
        if (typeof userId !== 'undefined') {
            const guardArgument = guard;

            guard = guard || '';

            cy.laravelCypressRequest(`login/${userId}/${guard}`, { log: false });

            return cy
                .currentUser<U>(guard)
                .then(user => {
                    Cypress.log({
                        name: 'login',
                        message: [userId, guardArgument],
                        consoleProps: () => ({ userId, guard: guardArgument, yielded: user }),
                    });

                    cy.wrap(user, { log: false }).as('user');

                    return cy.get('@user', { log: false }) as any as Cypress.Chainable<U>;
                });
        }

        return cy.create('User').then(user => cy.login(user.id, guard));
    },

    logout(guard?: string): void {
        Cypress.log({
            name: 'logout',
            message: [guard],
            consoleProps: () => ({ guard }),
        });

        guard = guard || '';

        cy.laravelCypressRequest(`logout/${guard}`, { log: false });
    },

    artisan(command: string, parameters?: object): void {
        Cypress.log({
            name: 'artisan',
            message: [command, parameters],
            consoleProps: () => ({ command, parameters })
        });

        cy.csrfToken().then(
            csrfToken =>
                cy.laravelCypressRequest('call_artisan', {
                    method: 'POST',
                    body: {
                        _token: csrfToken,
                        command,
                        parameters,
                    },
                    log: false,
                }),
        );
    },

};

export default customCommands;

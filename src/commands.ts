interface Model {
    id: string;
}

interface User extends Model {
    email: string;
}

const customCommands = {

    laravelCypressRequest(arg: any): Cypress.Chainable<Cypress.Response> {
        const options: Partial<Cypress.LaravelCypressRequestOptions> =
            typeof arg === 'string'
                ? { path: arg }
                : arg;
        const laravelUrl = Cypress.env('LARAVEL_URL') ?? Cypress.env('laravelUrl') ?? '';
        const { path, ...requestOptions } = options;

        return cy.request({
            url: `${laravelUrl}/_cypress/${path}`,
            ...requestOptions,
        });
    },

    setup(): void {
        cy.laravelCypressRequest('setup');
    },

    csrfToken(): Cypress.Chainable<string> {
        return cy.laravelCypressRequest('csrf_token').its('body');
    },

    currentUser<U extends User = any>(guard?: string): Cypress.Chainable<U> {
        guard = guard || '';

        return cy.laravelCypressRequest(`current_user/${guard}`).its('body');
    },

    create<M extends Model = any>(
        modelClass: string,
        quantityOrAttributes?: number | any,
        attributes?: any,
    ): Cypress.Chainable<M> {
        let quantity;

        if (typeof quantityOrAttributes === 'object')
            attributes = quantityOrAttributes;
        else if (typeof quantityOrAttributes === 'number')
            quantity = quantityOrAttributes;

        return cy.csrfToken().then(
            csrfToken => cy.laravelCypressRequest({
                path: 'create_models',
                method: 'POST',
                body: {
                    _token: csrfToken,
                    modelClass,
                    quantity,
                    attributes,
                },
            })
                .its('body')
        );
    },

    login<U extends User = any>(userId?: number, guard?: string): Cypress.Chainable<U> {
        if (typeof userId !== 'undefined') {
            guard = guard || '';

            cy.laravelCypressRequest(`login/${userId}/${guard}`);

            return cy.currentUser<U>(guard).then(user => {
                cy.wrap(user).as('user');

                return cy.get('@user') as any as Cypress.Chainable<U>;
            });
        }

        return cy.create('User').then(user => cy.login(user.id, guard));
    },

    logout(guard?: string): void {
        guard = guard || '';

        cy.laravelCypressRequest(`logout/${guard}`);
    },

    artisan(command: string, parameters?: object): void {
        cy.csrfToken().then((csrfToken) =>
          cy.laravelCypressRequest({
            path: 'call_artisan',
            method: "POST",
            body: {
              _token: csrfToken,
              command,
              parameters,
            },
          })
        )
    },

};

export default customCommands;

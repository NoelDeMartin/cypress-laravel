interface Model {
    id: string;
}

interface User extends Model {
    email: string;
}

const laravelAppBaseUrl = () => {
    return Cypress.env("CYPRESS_LARAVEL_APP_BASE_URL") ?? ""
}

const customCommands = {

    setup(): void {
        cy.request(`${laravelAppBaseUrl()}/_cypress/setup`);
    },

    csrfToken(): Cypress.Chainable<string> {
        return cy.request(`${laravelAppBaseUrl()}/_cypress/csrf_token`).its('body');
    },

    currentUser<U extends User = any>(guard?: string): Cypress.Chainable<U> {
        guard = guard || '';

        return cy.request(`${laravelAppBaseUrl()}/_cypress/current_user/${guard}`).its('body');
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
            csrfToken => cy.request({
                url: `${laravelAppBaseUrl()}/_cypress/create_models`,
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

            cy.request(`${laravelAppBaseUrl()}/_cypress/login/${userId}/${guard}`);

            return cy.currentUser<U>(guard).then(user => {
                cy.wrap(user).as('user');

                return cy.get('@user') as any as Cypress.Chainable<U>;
            });
        }

        return cy.create('User').then(user => cy.login(user.id, guard));
    },

    logout(guard?: string): void {
        guard = guard || '';

        cy.request(`${laravelAppBaseUrl()}/_cypress/logout/${guard}`);
    },

    artisan(command: string, parameters?: object): void {
        cy.csrfToken().then((csrfToken) =>
          cy.request({
            url: `${laravelAppBaseUrl()}/_cypress/call_artisan`,
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

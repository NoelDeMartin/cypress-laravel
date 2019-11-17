interface Model {
    id: string;
}

interface User extends Model {
    email: string;
}

const customCommands = {

    setup(): void {
        cy.request('/_cypress/setup');
    },

    csrfToken(): Cypress.Chainable<string> {
        return cy.request('/_cypress/csrf_token').its('body');
    },

    currentUser<U extends User = any>(guard?: string): Cypress.Chainable<U> {
        guard = guard || '';

        return cy.request(`/_cypress/current_user/${guard}`).its('body');
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
                url: '/_cypress/create_models',
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

            cy.request(`/_cypress/login/${userId}/${guard}`);

            return cy.currentUser<U>(guard).then(user => {
                cy.wrap(user).as('user');

                return cy.get('@user') as any as Cypress.Chainable<U>;
            });
        }

        return cy.create('User').then(user => cy.login(user.id, guard));
    },

    logout(guard?: string): void {
        guard = guard || '';

        cy.request(`/_cypress/logout/${guard}`);
    },

};

for (const command in customCommands) {
    Cypress.Commands.add(command, (customCommands as any)[command]);
}

export default customCommands;

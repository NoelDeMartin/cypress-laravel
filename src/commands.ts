const customCommands = {

    setup(): void {
        cy.request('/_cypress/setup');
    },

    csrfToken(): Cypress.Chainable<string> {
        return cy.request('/_cypress/csrf_token').its('body');
    },

    create<M = any>(modelClass: string): Cypress.Chainable<M> {
        return cy.csrfToken().then(
            csrfToken => cy.request({
                url: '/_cypress/create_models',
                method: 'POST',
                body: {
                    _token: csrfToken,
                    modelClass,
                },
            })
                .its('body')
        );
    },

};

for (const command in customCommands) {
    Cypress.Commands.add(command, (customCommands as any)[command]);
}

export default customCommands;

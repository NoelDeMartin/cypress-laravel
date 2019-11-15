const customCommands = {

    setup(): void {
        cy.request('/_cypress/setup');
    },

    csrfToken(): Cypress.Chainable<string> {
        return cy.request('/_cypress/csrf_token').its('body');
    },

    create<M = any>(
        modelClass: string,
        quantityOrAttributes?: object | number,
        attributes?: object,
    ): Cypress.Chainable<M> {
        let quantity = 1;

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

};

for (const command in customCommands) {
    Cypress.Commands.add(command, (customCommands as any)[command]);
}

export default customCommands;

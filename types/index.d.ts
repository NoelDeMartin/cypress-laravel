/// <reference types="cypress" />

interface User {
    id: string;
}

declare global {

    namespace Cypress {

        interface Chainable<Subject> {

            create<M = any>(
                modelClass: string,
                quantityOrAttributes?: number | any,
                attributes?: any,
            ): Cypress.Chainable<M>;

            login<U extends User = any>(userId?: number, guard?: string): Cypress.Chainable<U>;

        }

    }

}

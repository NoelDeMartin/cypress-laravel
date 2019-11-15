/// <reference types="cypress" />

declare global {

    namespace Cypress {

        interface Chainable<Subject> {

            create<M = any>(modelClass: string): Cypress.Chainable<M>;

        }

    }

}

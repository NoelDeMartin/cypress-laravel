/// <reference types="cypress" />

import commands from '@/commands';

type CustomCommands = {
    [command in keyof typeof commands]: typeof commands[command];
};

interface Model {
    id: string;
}

declare global {

    namespace Cypress {

        interface Chainable<Subject> extends CustomCommands {

            create<M extends Model = any>(model: string, attributes?: any): Cypress.Chainable<M>;
            create<M extends Model = any>(model: string, quantity: number, attributes?: any): Cypress.Chainable<M>;

            // Added in Cypress 3.8.0, backwards compatible.
            its<K extends keyof Subject>(propertyName: K, options: { log?: boolean }): Chainable<Subject[K]>

        }

    }

}

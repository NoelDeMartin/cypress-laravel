/// <reference types="cypress" />

import commands from '@/commands';

type CustomCommands<Subject> = {
    [command in keyof typeof commands]: typeof commands[command];
};

declare global {

    namespace Cypress {

        interface Chainable<Subject> extends CustomCommands<Subject> {

        }

    }

}

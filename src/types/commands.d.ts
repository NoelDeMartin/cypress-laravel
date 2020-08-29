/// <reference types="cypress" />

import commands from '@/commands';

type CustomCommands = {
    [command in keyof typeof commands]: typeof commands[command];
};

declare global {

    namespace Cypress {

        type LaravelCypressRequestOptions = Omit<RequestOptions, 'url'> & { path: string };

        interface Chainable extends CustomCommands {

            laravelCypressRequest(options: Partial<LaravelCypressRequestOptions>): Chainable<Response>;
            laravelCypressRequest(action: string): Chainable<Response>

        }

    }

}

import laravelCommands from '@/commands';

interface CypressLaravelOptions {
    commands: string[];
}

function registerLaravelCommands() {
    for (const command in laravelCommands) {
        Cypress.Commands.add(command as keyof Cypress.Chainable, (laravelCommands as any)[command]);
    }
}

function registerCustomCommands(commands: string[]) {
    for (const command of commands) {
        Cypress.Commands.add(
            command as keyof Cypress.Chainable,
            (...args: any[]) => cy.laravelCypressCommand(command, ...args),
        );
    }
}

function prepareTestHooks() {
    if (Cypress.config('laravelPluginsRegistered' as keyof Cypress.Config)) {
        before(() => cy.task('activateCypressEnvFile'));
        after(() => cy.task('restoreBackupEnvFile'));
    }

    beforeEach(() => cy.setup());
}

export function useCypressLaravel(options: Partial<CypressLaravelOptions> = {}) {
    registerLaravelCommands();
    registerCustomCommands(options.commands || []);
    prepareTestHooks();
}

export function useDatabaseMigrations() {
    beforeEach(() => cy.artisan('migrate:fresh'));
}

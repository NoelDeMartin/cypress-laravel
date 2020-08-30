import customCommands from '@/commands';

export function useCypressLaravel() {
    for (const command in customCommands) {
        Cypress.Commands.add(command, (customCommands as any)[command]);
    }

    if (Cypress.config('laravelPluginsRegistered')) {
        before(() => cy.task('activateCypressEnvFile'));
        after(() => cy.task('restoreBackupEnvFile'));
    }

    beforeEach(() => cy.setup());
}

export function useDatabaseMigrations() {
    beforeEach(() => cy.artisan('migrate:fresh'));
}

/// <reference types="cypress" />

interface Model {
    id: string;
}

interface User extends Model {
    email: string;
}

declare global {

    namespace Cypress {

        interface Chainable<Subject> {

            create<M extends Model = any>(
                modelClass: string,
                quantityOrAttributes?: number | any,
                attributes?: any,
            ): Cypress.Chainable<M>;

            login<U extends User = any>(userId?: number, guard?: string): Cypress.Chainable<U>;

            logout(guard?: string): void;

            artisan(command: string, parameters?: object): void;

        }

    }

}

export function useCypressLaravel(): void;

export function useDatabaseMigrations(): void;

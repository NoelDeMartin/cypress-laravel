/// <reference types="cypress" />

interface Model {
    id: string;
}

interface User extends Model {
    email: string;
}

declare global {

    namespace Cypress {

        interface Chainable {

            create<M extends Model = any>(model: string, attributes?: any): Cypress.Chainable<M>;
            create<M extends Model = any>(model: string, quantity: number, attributes?: any): Cypress.Chainable<M>;

            login<U extends User = any>(userId?: number, guard?: string): Cypress.Chainable<U>;

            logout(guard?: string): void;

            artisan(command: string, parameters?: object): void;

        }

    }

}

export function useCypressLaravel(): void;

export function useDatabaseMigrations(): void;

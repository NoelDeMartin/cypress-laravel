# Cypress Laravel

This Cypress plugin exposes commands and functions to test Laravel applications. In order to use it, the Laravel app must have the [laravel-cypress](https://github.com/NoelDeMartin/laravel-cypress) package installed.

You can read the following article to learn how this works: [Testing Laravel Applications Using Cypress](https://noeldemartin.com/blog/testing-laravel-applications-using-cypress).

## Installation

Install the package using npm:

```
npm install cypress-laravel --save-dev
```

And add the following at the beginning of your setup file at `cypress/support/index.js`:

```js
import { useCypressLaravel } from 'cypress-laravel';

useCypressLaravel();

// ...
```

## Commands

This package includes [typescript definitions](types/index.d.ts), check them out to learn about the full API.

### create

Create models using Laravel [factories](https://laravel.com/docs/6.x/database-testing#using-factories).

```js
cy.create('App\\User', 3, { is_admin: false })
  .then(users => {
      // ...
  });
```

Quantity and attributes are optional arguments.

### login / logout

Login or logout a user with Laravel's [authentication](https://laravel.com/docs/6.x/authentication). User id and authentication guard can be specified.

The user object will also be wrapped as `user`, so it can be retrieved later on calling `cy.get('@user')`.

```js
cy.login().then(user => {
    // ...
});

// ...

cy.logout();
```

### artisan

Call an [artisan command](https://laravel.com/docs/7.x/artisan).

```js
cy.artisan('migrate:fresh');
```

## Functions

### useDatabaseMigrations

This function can be used in tests that interact with the database. It will reset the database before each test is executed.

```js
describe('Feature', () => {

    useDatabaseMigrations();

    it('should do something with the database', () => {
        //...
    });

})
```

## Sandbox project

To see a working example, check out this project with a bare-bones Laravel application using this package with tests running on CI: [laravel-cypress-sandbox](https://github.com/NoelDeMartin/laravel-cypress-sandbox/).

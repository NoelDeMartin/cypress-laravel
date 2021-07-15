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

### Swapping env files

If you want to use a specific environment file to run Cypress tests, you can create a `.env.cypress` file in your Laravel application and it will be swapped when the tests are running.

For this to work properly, Cypress should be installed in the root of the Laravel application. Additionally, you should register the plugin in your `cypress/plugins/index.js` file like this:

```js
module.exports = (on, config) => {
    require('cypress-laravel/plugins')(on, config);

    return config;
};
```

### Custom Laravel url

By default, the plugin assumes that the frontend under test is being served on the same domain as the laravel application.

If that's not the case, you can specify a different url setting the `env.laravelUrl` property in your `cypress.json` config file:

```json
{
    "baseUrl": "http://frontend.test",
    "env": {
        "laravelUrl": "http://backend.test"
    }
}
```

You can also override this value by setting the `CYPRESS_LARAVEL_URL` env variable:

```sh
CYPRESS_LARAVEL_URL=http://backend.test npm run cypress
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

Call an [artisan command](https://laravel.com/docs/artisan).

```js
cy.artisan('migrate:fresh');
```

This yields the output of the artisan command, so it can be used to get json output of some commands, for example:

```js
cy.artisan('route:list --json').then(routes => {
    // `routes` will be an array of objects.
});
```

### Define your own commands

If you need a command that isn't included in this package, you can define it using some helpers.

In the Laravel app, register the command in a Service Provider:

```php
public function boot() {
    Cypress::command('greet', function (string $name) {
        return "Hello $name!";
    });
}
```

And declare it in your Cypress setup file:

```js
useCypressLaravel({ commands: ['greet'] });
```

You can call custom commands in the same way that you call other commands:

```js
cy.greet('Guest').then(greeting => {
    expect(greeting).to.equal('Hello Guest!');
});
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

To see a working example with different use-cases, check out the following project: [laravel-cypress-sandbox](https://github.com/NoelDeMartin/laravel-cypress-sandbox/).

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v0.2.0](https://github.com/NoelDeMartin/cypress-laravel/releases/tag/v0.2.0) - 2020-08-30

### Added

- Improved Cypress command logs.
- Added tasks to [swap environment files](https://github.com/NoelDeMartin/cypress-laravel/tree/v0.2.0#swapping-env-files) automatically.
- [#3](https://github.com/NoelDeMartin/cypress-laravel/issues/3) Added helpers to [define custom commands](https://github.com/NoelDeMartin/cypress-laravel/tree/v0.2.0#define-your-own-commands).
- [#5](https://github.com/NoelDeMartin/cypress-laravel/issues/5) Added configuration options to [customize the laravel url](https://github.com/NoelDeMartin/cypress-laravel/tree/v0.2.0#custom-laravel-url). Thanks [@lucaspottersky](https://github.com/lucaspottersky)!

## [v0.1.0](https://github.com/NoelDeMartin/cypress-laravel/releases/tag/v0.1.0) - 2020-05-09

### Added

- `useDatabaseMigrations` function.

### Changed

- Plugin installation has been refactored. This was necessary in order to export functions from the package.

## [v0.0.3](https://github.com/NoelDeMartin/cypress-laravel/releases/tag/v0.0.3) - 2019-11-17

### Added

- `logout` method.

### Removed

- Removed `laravel/dusk` dependency for authentication methods.

## [v0.0.2](https://github.com/NoelDeMartin/cypress-laravel/releases/tag/v0.0.2) - 2019-11-15

### Added

- Everything! Read [this blog post](https://noeldemartin.com/blog/testing-laravel-applications-using-cypress) for an introduction.

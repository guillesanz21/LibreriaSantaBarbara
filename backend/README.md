<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

<!-- <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a> -->

## Description

Backend of the application [Made with NestJS].

## Links

- Swagger: http://localhost:3000/docs
- Maildev: http://localhost:1080

## Build the app

```bash
# Sudo is needed to remove previous data of the database (if any)
$ sudo ./main build
```

## Running the app

```bash
# development. It runs migrations and seeders automatically
$ ./main dev
```

## Test

```bash
# unit tests
$ ./main testlocal

# e2e and unit tests. Sudo is needed to clean the testing database
$ sudo ./main test
```

<!--
TODO:
# test coverage
$ npm run test:cov
 -->

## Database (Migrations)

```bash
# Generate migrations. Sudo is needed to give the proper permissions to the file
$ sudo ./main migrations:generate  migrationName

# Run migrations
$ ./main migrations:run
```

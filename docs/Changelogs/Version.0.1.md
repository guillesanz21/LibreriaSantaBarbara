# Version 0.1

## Description

Configuration + Authentication/Authorization + Basic services

## Date

07/06/2021

## Changelog

- [x] GitHub Repo
- [x] NestJS project generation
- [x] Linters
- [x] NestJS skeleton and configuration
  - [x] TypeORM connection
  - [x] Test and Dev environments
- [x] Docker compose files (test and dev)
  - [x] Server
  - [x] Databases
- [x] Entities and create DTOs related to Users and Books
  - [x] Tables and DTOs
  - [x] Relations
  - [x] Migrations
  - [x] Seeds
- [x] Users module
  - [x] Service and controller
  - [x] Unit Testing
- [x] Base CRUD Service
- [x] Special validators for DTOs:
  - [x] IsISO6391
  - [x] IsNotExists
  - [x] IsExists
  - [x] IsUnique
  - [x] IsCompositeUnique
- [x] Auth module
  - [x] Hashing password
  - [x] Passport config
  - [x] JWT
  - [x] Service and controller
  - [x] Roles table
  - [x] Guards, interceptors, decorators
  - [x] Exclude / auth groups in entities
- [x] Swagger
- [x] Admin
  - [x] Complete users service to add the feature for approval/rejection of a store
  - [x] Controller
- [x] Mail sender
  - [x] Docker service
  - [x] Configuration
  - [x] Templates
  - [x] Service

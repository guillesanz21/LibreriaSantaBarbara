# Software Architecture

## Deployment

### Virtualization

In order to ease the _development_ and _testing_ processes, the application will be virtualizated in containers, so it can be deployed locally easily. For this virutalization, we will use **Docker** and **Docker Compose**.

In addition, we will use **Docker** once we deploy the application in a serious cloud provider for _production_ like AWS, so we can use services like AWS EC2.

In the future, if the application grows significally, we can use **Kubernetes** to dinamically scale the application to the traffic demand.

### Cloud provider

In the first instance it is likely that the backend and database will be deployed on Heroku or another free PaaS. Once the MVP it is validated by the user, it will be deployed on a more reliable cloud provider: **AWS**? **Azure**? **GCP**?

- All the components will be referenced to AWS, but in the case of using a different one, find the alternative in the cloud provider.

## CI/CD

When the time comes, a CI/CD pipeline will be implemented with **GitHub Actions**. The pipeline will check if the code is properly _linted_ and will _test_ (unit and e2e) the application, as the bare minimum. Besides, it will check that the commits are not being pushed to the _production_ branch.

When accepting a pull request to the _production_ branch, it will also _build_ and _deploy_ the application to the provider.

## Linters

- ESLint
- Sonarlint
- Prettier

## Database

- PostgreSQL in develpment and testing
  - For production:
    - PostgreSQL in a container (AWS EC2 or the alternative for Azure/GCP)
    - AWS RDS or the alternative for Azure/GCP
- Redis —> Cache
- CEPH / AWS S3 or other file system for store images and other actives

## Backend

(TypeScript)

- NestJS with ExpressJS
- REST API
  - (FUTURE) Maybe GraphQL could be useful if the requests become complex.
- Socket IO
- ORM → TypeORM.
- Authorization / authentication → Passport
  - JWT
  - Roles
  - (FUTURE) Policies / permissions?
- (FUTURE) Payment handler → ??
- Testing → Jest
- API documentation → Swagger
- Other interesting libraries:
  - File upload → Multer
  - Email sender → Mailer

## Web

(TypeScript)

- React
- SASS
- Bootstrap.
  - For the MVP saves development time, in the future we should get rid of it in order to improve performance.
- Testing?
- Next.JS (FUTURE)

### Mobile

(TypeScript)

- React Native

### Desktop?

(TypeScript)

- Electron

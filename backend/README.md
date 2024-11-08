# User Service

The users service manages users and also to which tenant they belong.
New users and tenant can be created and existing ones can be updated or deleted.

## Prerequisites

- Docker and Docker Compose installed on your system
- Make (optional, but recommended)

## Running with Docker (Recommended)

Start all services (database, backend, frontend):

```bash
make up
```

Once the services are running, the backend service will be available at `http://localhost:3000` and the frontend at `http://localhost:4200`. You can now initialize the database:

```bash
# Run database migrations and seed data
docker compose exec backend npx prisma db push
docker compose exec backend npx prisma db seed
```

## Local Development Setup (without Docker)

Install dependencies and push and seed the database schema:

```bash
yarn install
npx prisma db push
npx prisma db seed
```

## Tests

The test suite needs a database to be setup but the database container defined in the docker compose file can be used for that purpose. In order to do so, it's recommended to spin up the containers with:

```bash
make up
```

Then, on a separate terminal, run the following command to get a shell into the backend container:

```bash
make shell
```

Finally within the backend container, when running the following command, everything should be setup before the tests run:

```bash
yarn test
```

## Linting

Linting is configured using [ESLint](https://eslint.org/) (Linting rules) in combination with [Prettier](https://prettier.io/) (enforce linting rules through formatting).

- To run linting: `yarn lint`
- To run source code formatting: `yarn format`

## Git Hooks

Git Hooks are configured using [Husky](https://github.com/typicode/husky):

- before each commit, all files that are staged are formatted based on linting rules
- this is done using [lint-staged](https://github.com/okonet/lint-staged)

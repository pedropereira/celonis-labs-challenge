# User Service
The users service manages users and also to which tenant they belong.
New users and tenant can be created and existing ones can be updated or deleted.


## Development
Have a postgres like defined in `.env`.

Install dependencies and push and seed the database schema:
```bash
yarn install
npx prisma db push
npx prisma db seed
```

## Tests

- Unit test: `yarn test:unit`
- Integration tests: `yarn test:integration`

## Linting

Linting is configured using [ESLint](https://eslint.org/) (Linting rules) in combination with [Prettier](https://prettier.io/) (enforce linting rules through formatting).

- To run linting: `yarn lint`
- To run source code formatting: `yarn format`

## Git Hooks

Git Hooks are configured using [Husky](https://github.com/typicode/husky):

- before each commit, all files that are staged are formatted based on linting rules
- this is done using [lint-staged](https://github.com/okonet/lint-staged)

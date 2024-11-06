FROM node:18 AS install_production_dependencies

WORKDIR /usr/src/app

COPY package.json tsconfig.json yarn.lock ./

RUN yarn install --production


FROM node:18-alpine

WORKDIR /usr/src/app

COPY --from=install_production_dependencies /usr/src/app/node_modules node_modules
COPY src ./src
COPY prisma ./prisma
COPY package.json tsconfig.json yarn.lock ./
COPY .env ./

RUN yarn install
RUN npx prisma generate

CMD ["yarn", "start"]

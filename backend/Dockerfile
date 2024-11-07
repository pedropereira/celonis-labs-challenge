# Stage 1: Base with common configuration
FROM node:18-alpine AS base

WORKDIR /usr/src/app

COPY package.json tsconfig.json yarn.lock ./

# Stage 2: Development dependencies
FROM base AS development

COPY . .
RUN yarn install --frozen-lockfile
RUN npx prisma generate

CMD ["yarn", "dev"]

# Stage 3: Build application artefacts
FROM development AS build

RUN yarn build

# Stage 4: Prune development dependencies
FROM development AS prune

RUN yarn install --production --frozen-lockfile

# Stage 5: Production
FROM base AS production

COPY --from=prune /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

CMD ["node", "dist/index.js"]

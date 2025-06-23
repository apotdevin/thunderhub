# ---------------
# Base Image
# ---------------
FROM node:20.11.1-alpine AS base

WORKDIR /app

# Set env variables
ARG BASE_PATH=""
ENV BASE_PATH=${BASE_PATH}
ENV NEXT_TELEMETRY_DISABLED=1

# ---------------
# Install Dependencies
# ---------------
FROM base AS deps

# Install dependencies neccesary for node-gyp on node alpine
RUN apk add --update --no-cache \
  libc6-compat \
  python3 \
  make \
  g++

# Install app dependencies
COPY package.json package-lock.json ./
RUN npm ci

# ---------------
# Build App
# ---------------
FROM deps AS build

ARG NODE_ENV="production"
ENV NODE_ENV=${NODE_ENV}

# Build the NestJS and NextJS application
COPY . .
RUN npm run build:nest
RUN npm run build:next

# Remove non production necessary modules
RUN npm prune --production

# ---------------
# Release App
# ---------------
FROM base AS final

ARG NODE_ENV="production"
ENV NODE_ENV=${NODE_ENV}

COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules/ ./node_modules

# Copy NextJS files
COPY --from=build /app/src/client/public ./src/client/public
COPY --from=build /app/src/client/next.config.js ./src/client/
COPY --from=build /app/src/client/.next/ ./src/client/.next

# Copy NestJS files
COPY --from=build /app/dist/ ./dist

EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]

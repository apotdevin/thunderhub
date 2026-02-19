FROM node:24.13.1-alpine AS base

# ---------------
# Install Dependencies
# ---------------
FROM base AS deps

WORKDIR /app

# Install dependencies necessary for node-gyp on node alpine
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

WORKDIR /app

# Set env variables
ARG BASE_PATH=""
ENV BASE_PATH=${BASE_PATH}
ARG NODE_ENV="production"
ENV NODE_ENV=${NODE_ENV}

# Build the NestJS and Vite application
COPY . .
RUN npm run build:nest && npm run build:client

# Remove non production necessary modules
RUN npm prune --omit=dev

# ---------------
# Release App
# ---------------
FROM base AS final

WORKDIR /app

# Set env variables
ARG BASE_PATH=""
ENV BASE_PATH=${BASE_PATH}
ENV NODE_ENV="production"

# Copy build artifacts
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules/ ./node_modules
COPY --from=build /app/src/client/dist/ ./src/client/dist
COPY --from=build /app/dist/ ./dist

# Run as non-root user
USER node

ENV PORT=3000
EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]

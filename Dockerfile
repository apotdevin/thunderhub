# ---------------
# Install Dependencies
# ---------------
FROM node:14.15-alpine as deps

WORKDIR /app

# Install dependencies neccesary for node-gyp on node alpine
RUN apk add --update --no-cache \
    libc6-compat \
    python \
    make \
    g++

# Install app dependencies
COPY package.json package-lock.json ./
RUN npm ci

# ---------------
# Build App
# ---------------
FROM deps as build

WORKDIR /app

# Set env variables
ARG BASE_PATH=""
ENV BASE_PATH=${BASE_PATH}
ARG NODE_ENV="production"
ENV NODE_ENV=${NODE_ENV}
ENV NEXT_TELEMETRY_DISABLED=1

# Build the NestJS and NextJS application
COPY . .
RUN npm run build:nest
RUN npm run build:next

# Remove non production necessary modules
RUN npm prune --production

# ---------------
# Release App
# ---------------
FROM node:14.15-alpine as final

RUN set -x \
  # Change node uid/gid
  && apk --no-cache add shadow \
  && groupmod -g 1001 node \
  && usermod -u 1001 -g 1001 node

RUN set -x \
    # Add user
    && addgroup --gid 1000 app \
    && adduser --disabled-password \
        --gecos '' \
        --ingroup app \
        --home /app \
        --uid 1000 \
        app

USER app
WORKDIR /app

# Set env variables
ARG BASE_PATH=""
ENV BASE_PATH=${BASE_PATH}
ARG NODE_ENV="production"
ENV NODE_ENV=${NODE_ENV}
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=build --chown=app:app /app/package.json ./
COPY --from=build --chown=app:app /app/node_modules/ ./node_modules

# Copy NextJS files
COPY --from=build --chown=app:app /app/src/client/public ./src/client/public
COPY --from=build --chown=app:app /app/src/client/next.config.js ./src/client/
COPY --from=build --chown=app:app /app/src/client/.next/ ./src/client/.next

# Copy NestJS files
COPY --from=build --chown=app:app /app/dist/ ./dist

EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]

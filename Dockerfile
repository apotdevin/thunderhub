# ---------------
# Install Dependencies
# ---------------
FROM node:24.13.1-alpine as deps

WORKDIR /app

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
FROM deps as build

WORKDIR /app

# Set env variables
ARG BASE_PATH=""
ENV BASE_PATH=${BASE_PATH}
ARG NODE_ENV="production"
ENV NODE_ENV=${NODE_ENV}

# Build the NestJS and Vite application
COPY . .
RUN npm run build:nest
RUN npm run build:client

# Remove non production necessary modules
RUN npm prune --production

# ---------------
# Release App
# ---------------
FROM node:24.13.1-alpine as final

WORKDIR /app

# Set env variables
ARG BASE_PATH=""
ENV BASE_PATH=${BASE_PATH}
ARG NODE_ENV="production"
ENV NODE_ENV=${NODE_ENV}

COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules/ ./node_modules

# Copy Vite client build
COPY --from=build /app/src/client/dist/ ./src/client/dist

# Copy NestJS files
COPY --from=build /app/dist/ ./dist

ENV PORT=3000
EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]

# ---------------
# Install Dependencies
# ---------------
# FROM node:12-alpine as build
FROM arm64v8/node:12-alpine as build

# Install dependencies neccesary for node-gyp on node alpine
RUN apk add --update --no-cache \
    python \
    make \
    g++

# Install app dependencies
COPY package.json .
COPY yarn.lock .
RUN yarn install --network-timeout 100000 --silent --prod
RUN yarn add --dev cross-env

# ---------------
# Build App
# ---------------
FROM arm64v8/node:12-alpine

WORKDIR /app

# Copy dependencies from build stage
COPY --from=build node_modules node_modules

# Bundle app source
COPY . .
RUN yarn build
EXPOSE 3000

CMD [ "yarn", "start" ]
# ---------------
# Install Dependencies
# ---------------
FROM node:12-alpine as build

# Install dependencies neccesary for node-gyp on node alpine
RUN apk add --update --no-cache \
    python \
    make \
    g++

# Install app dependencies
COPY package.json .
COPY yarn.lock .
RUN yarn install --silent --production=true
RUN yarn add --dev cross-env

# ---------------
# Build App
# ---------------
FROM node:12-alpine

# Copy dependencies from build stage
COPY --from=build node_modules node_modules

# Bundle app source
COPY . .
RUN yarn tslint
RUN yarn test
RUN yarn build
EXPOSE 3000

CMD [ "yarn", "start" ]
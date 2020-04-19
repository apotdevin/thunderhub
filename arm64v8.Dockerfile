FROM arm64v8/node:12-alpine

# Create app directory
WORKDIR /usr/src/app

# Install build dependencies
RUN apk update && apk upgrade \
    && apk --no-cache add --virtual build-deps build-base python \
    && yarn add node-gyp node-pre-gyp

# Install app dependencies
COPY package.json /usr/src/app/
COPY yarn.lock /usr/src/app/
RUN yarn --network-timeout 300000 --production=true
RUN yarn add cross-env

# Remove build dependencies
RUN apk del build-deps

# Bundle app source
COPY . /usr/src/app
RUN yarn build
EXPOSE 3000

CMD [ "yarn", "start" ]
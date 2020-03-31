FROM node:11-alpine

WORKDIR /usr/src/server

RUN apk update && apk upgrade \
    && apk --no-cache add --virtual builds-deps build-base python \
    && yarn add node-gyp node-pre-gyp

COPY package.json /usr/src/client
COPY yarn.lock /usr/src/client
RUN yarn install --production=true

COPY . /usr/src/server
RUN yarn install --production=true
RUN yarn global add webpack
RUN yarn build

EXPOSE 3001

CMD ["npm", "start"]
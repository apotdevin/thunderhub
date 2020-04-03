FROM node:11-alpine as build

WORKDIR /usr/src/client

COPY package.json /usr/src/client
COPY yarn.lock /usr/src/client
RUN yarn install --production=true

COPY . /usr/src/client
RUN yarn build

RUN yarn global add serve

CMD ["serve", "-s", "build"]
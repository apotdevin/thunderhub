FROM node:11-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .
RUN apk update && apk upgrade \
  && apk --no-cache add --virtual builds-deps build-base python \
  && yarn add node-gyp node-pre-gyp
RUN yarn install --production=true
RUN yarn global add webpack
RUN yarn build

EXPOSE 3001

CMD ["npm", "start"]
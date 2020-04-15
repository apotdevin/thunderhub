FROM node:11-alpine

# Create app directory
WORKDIR /usr/src/app

RUN apk update && apk upgrade \
    && apk --no-cache add --virtual builds-deps build-base python \
    && npm install node-gyp node-pre-gyp

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install --only=prod
RUN npm install cross-env

# Bundle app source
COPY . /usr/src/app
RUN npm run build
EXPOSE 3000

CMD [ "npm", "start" ]
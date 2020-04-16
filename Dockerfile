FROM node:12-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
COPY yarn.lock /usr/src/app/
RUN yarn --network-timeout 300000 --production=true
RUN yarn add cross-env

# Bundle app source
COPY . /usr/src/app
RUN yarn build
EXPOSE 3000

CMD [ "yarn", "start" ]
FROM node:alpine

# Create app directory
# RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
COPY yarn.lock /usr/src/app/
RUN yarn install --production=true

# Bundle app source
COPY . /usr/src/app
RUN yarn build
EXPOSE 3000
CMD [ "yarn", "start" ]
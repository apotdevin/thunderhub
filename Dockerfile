FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install --only=prod
RUN npm install cross-env

# Bundle app source
COPY . /usr/src/app
RUN npm run build
EXPOSE 3000

CMD [ "npm", "run", "start" ]
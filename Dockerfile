# ---------------
# Install Dependencies
# ---------------
FROM node:12.16-alpine as build

# Install dependencies neccesary for node-gyp on node alpine
RUN apk add --update --no-cache \
    python \
    make \
    g++

# Install app dependencies
COPY package.json .
COPY package-lock.json .
RUN npm install --production --silent

# ---------------
# Build App
# ---------------
FROM node:12.16-alpine

WORKDIR /app

# Copy dependencies from build stage
COPY --from=build node_modules node_modules

# Bundle app source
COPY . .
RUN npm run build
EXPOSE 3000

CMD [ "npm", "start" ]
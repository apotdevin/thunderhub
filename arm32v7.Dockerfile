# ---------------
# Install Dependencies
# ---------------
FROM arm32v7/node:14.15-alpine as build

# Install dependencies neccesary for node-gyp on node alpine
RUN apk add --update --no-cache \
    python \
    make \
    g++

# Install app dependencies
COPY package.json .
COPY package-lock.json .
RUN npm install --silent

# Build the NextJS application
COPY . .
RUN npm run build

# Remove non production necessary modules
RUN npm prune --production

# ---------------
# Build App
# ---------------
FROM arm32v7/node:14.15-alpine

WORKDIR /app

# Copy dependencies and build from build stage
COPY --from=build node_modules node_modules
COPY --from=build .next .next

# Bundle app source
COPY . .
EXPOSE 3000

CMD [ "npm", "start" ]
# ---------------
# Install Dependencies
# ---------------
FROM node:14.15-alpine as deps

WORKDIR /app

# Install dependencies neccesary for node-gyp on node alpine
RUN apk add --update --no-cache \
    libc6-compat \
    python \
    make \
    g++


# Install app dependencies
COPY package.json package-lock.json ./
RUN npm install

# ---------------
# Build App
# ---------------
FROM deps as build

WORKDIR /app

# Set env variables
ARG BASE_PATH=""
ENV BASE_PATH=${BASE_PATH}
ENV NEXT_TELEMETRY_DISABLED=1

# Build the NextJS application
COPY . .
RUN npm run build

# Remove non production necessary modules
RUN npm prune --production

# ---------------
# Release App
# ---------------
FROM node:14.15-alpine

WORKDIR /app

# Set env variables
ARG BASE_PATH=""
ENV BASE_PATH=${BASE_PATH}
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=build /app/package.json /app/package-lock.json /app/next.config.js ./
COPY --from=build /app/public ./public
COPY --from=build /app/node_modules/ ./node_modules 
COPY --from=build /app/.next/ ./.next

COPY ./scripts/initCookie.sh ./scripts/initCookie.sh

EXPOSE 3000 

CMD [ "npm", "start" ]
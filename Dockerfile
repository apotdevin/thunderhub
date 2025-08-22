# ---------------
# Install Dependencies
# ---------------
FROM node:18.18.2-alpine as deps

WORKDIR /app

# Install dependencies necessary for node-gyp on node alpine
RUN apk add --update --no-cache \
  libc6-compat \
  python3 \
  make \
  g++

# Install pnpm
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install app dependencies using pnpm
RUN pnpm install --frozen-lockfile

# ---------------
# Build App
# ---------------
FROM deps as build

WORKDIR /app

# Set env variables
ARG BASE_PATH=""
ENV BASE_PATH=${BASE_PATH}
ARG NODE_ENV="production"
ENV NODE_ENV=${NODE_ENV}
ENV NEXT_TELEMETRY_DISABLED=1

# Copy all source files
COPY . .

# Build the NestJS and NextJS application
RUN pnpm run build:nest
RUN pnpm run build:next

# Remove non-production dependencies
RUN pnpm prune --prod

# ---------------
# Release App
# ---------------
FROM node:18.18.2-alpine as final

WORKDIR /app

# Install pnpm in the final stage
RUN npm install -g pnpm

# Set env variables
ARG BASE_PATH=""
ENV BASE_PATH=${BASE_PATH}
ARG NODE_ENV="production"
ENV NODE_ENV=${NODE_ENV}
ENV NEXT_TELEMETRY_DISABLED=1

# Copy package.json and pnpm-lock.yaml
COPY --from=build /app/package.json ./
COPY --from=build /app/pnpm-lock.yaml ./
COPY --from=build /app/node_modules/ ./node_modules

# Copy NextJS files
COPY --from=build /app/src/client/public ./src/client/public
COPY --from=build /app/src/client/next.config.js ./src/client/
COPY --from=build /app/src/client/.next/ ./src/client/.next

# Copy NestJS files
COPY --from=build /app/dist/ ./dist

EXPOSE 3000

CMD ["pnpm", "run", "start:prod"]
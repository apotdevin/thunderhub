# stage: 1
FROM node:11-alpine as build

WORKDIR /usr/src/client

COPY package.json /usr/src/client
COPY yarn.lock /usr/src/client
RUN yarn install --production=true

COPY . /usr/src/client
RUN yarn build

# stage: 2 — the production environment
FROM nginx:alpine
COPY /config/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/client/build /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
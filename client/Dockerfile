# stage: 1
FROM node:11-alpine as react-build
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .
RUN yarn install --production=true
RUN yarn build

# stage: 2 — the production environment
FROM nginx:alpine
COPY /config/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=react-build /usr/src/app/build /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
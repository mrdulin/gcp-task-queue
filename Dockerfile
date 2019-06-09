# system dependencies
FROM node:8.13.0-alpine AS system-dependencies
RUN apk update && apk add curl --no-cache
LABEL maintainer="lin.l.du"

# application dependencies
FROM system-dependencies AS application-dependencies
WORKDIR /app
COPY ./package.json ./package-lock.json /app/
RUN npm install -g npm@latest \
  && npm install

# test & build
FROM application-dependencies AS build
COPY . /usr/src/app
ENV NODE_ENV=production
RUN npm run build

# Release
FROM system-dependencies AS release
WORKDIR /app
COPY --from=application-dependencies /app/node_modules ./node_modules
COPY ./dist /app

CMD [ "npm", "start" ]
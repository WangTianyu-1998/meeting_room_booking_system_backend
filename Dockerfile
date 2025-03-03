# FROM node:latest-alpine3.14 as build-stage
FROM node:20-alpine3.20 AS build-stage

WORKDIR /app

COPY package.json .

# RUN npm config set registry https://registry.npmmirror.com/

# RUN npm install
RUN npm install --omit=dev --registry=https://registry.npm.taobao.org


COPY . .

RUN npm run build

# production stage
# FROM node:latest-alpine3.14 as production-stage
# FROM node:20-alpine3.17 as production-stage
FROM node:20-alpine3.20 AS production-stage

COPY --from=build-stage /app/dist /app
COPY --from=build-stage /app/package.json /app/package.json

WORKDIR /app

# RUN npm config set registry https://registry.npmmirror.com/
RUN npm install --omit=dev --registry=https://registry.npm.taobao.org


# RUN npm install --production

EXPOSE 3005

CMD ["node", "/app/main.js"]
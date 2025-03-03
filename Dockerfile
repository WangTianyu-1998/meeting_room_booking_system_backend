# FROM node:latest-alpine3.14 as build-stage
FROM node:20-alpine AS build-stage

WORKDIR /app

COPY package.json .

RUN npm config set registry https://registry.npmmirror.com/

RUN npm install

COPY . .

RUN npm run build

# production stage
# FROM node:latest-alpine3.14 as production-stage
# FROM node:20-alpine3.17 as production-stage
FROM node:20-alpine AS production-stage

COPY --from=build-stage /app/dist /app
COPY --from=build-stage /app/package.json /app/package.json

WORKDIR /app

RUN npm config set registry https://registry.npmmirror.com/

RUN npm install --production

EXPOSE 3005

CMD ["node", "/app/main.js"]
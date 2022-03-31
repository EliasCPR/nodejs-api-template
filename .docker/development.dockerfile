FROM node:16-alpine

WORKDIR /opt/app

COPY package.json .
COPY yarn.lock .

RUN yarn

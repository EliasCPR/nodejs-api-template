FROM node:14-alpine

WORKDIR /opt/app
COPY . .

### ENTRYPOINT/RUN
RUN yarn
RUN yarn build

CMD ["yarn", "start"]

# install dependencies
FROM node:12.13.1 as base

WORKDIR /baseapp

COPY package.json yarn.lock ./

RUN yarn 

COPY . .

RUN yarn build 

# deploy
FROM node:12.13.1-alpine

WORKDIR /app

ENV NODE_ENV=dev

COPY --from=base /baseapp/yarn.lock /baseapp/package.json ./
COPY --from=base /baseapp/build /app/build
COPY --from=base /baseapp/node_modules /app/node_modules

EXPOSE 8080

CMD ["yarn","start"]
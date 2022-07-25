FROM node:16.14.0-alpine AS development
WORKDIR /usr/src/app
COPY ./package.json yarn.lock ./
RUN yarn install
COPY ./ ./
RUN yarn build

FROM node:16.14.0-alpine AS production
WORKDIR /usr/src/app
COPY ./package.json yarn.lock ./
RUN yarn install --only=production
COPY --from=development /usr/src/app/dist ./dist
CMD yarn start:dev
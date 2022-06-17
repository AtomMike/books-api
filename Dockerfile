FROM node:alpine as base

WORKDIR /app

COPY ./src/package.json /app

RUN npm install

COPY ./src /app
COPY .env /app

EXPOSE 3000

CMD ["node", "./index.js"]
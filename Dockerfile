FROM node:10.15.1

ENV NODE_ENV=production

WORKDIR /var/www

COPY ./package*.json ./

RUN npm ci

COPY ./build ./build

CMD ["node", "build/main.js"]
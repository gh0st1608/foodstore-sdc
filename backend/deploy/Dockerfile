FROM node:20.11.1-alpine3.19

COPY ./.build/src/ /var/www/app/build/
COPY package.json /var/www/app/build/
#COPY .env /var/www/app/build/

WORKDIR /var/www/app/build
RUN npm i --production


EXPOSE 3333
CMD ["node", "main.js"]
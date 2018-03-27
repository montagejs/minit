FROM node:8

RUN mkdir /service
WORKDIR /service

ENV PATH /service/node_modules/.bin:$PATH

ADD package.json /service
RUN npm install

ADD . /service

EXPOSE 8080

CMD ["node", "main.js"]
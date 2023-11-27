FROM node:20.6.1

WORKDIR /src

COPY ["package.json", "package-lock.json", "./"]

RUN npm  install

EXPOSE 27017

COPY . .

CMD [ "npm", "run", "start"]

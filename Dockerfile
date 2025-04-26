FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm install redis

EXPOSE 3000

CMD ["npm", "run", "start:prod"]

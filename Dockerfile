FROM node:21.4.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3300

RUN npx prisma generate
CMD [ "npm", "run", "run" ]
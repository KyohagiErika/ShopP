FROM node:16.14.2
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
COPY .env.local .env
RUN npm run build
CMD [ "npm", "start" ]
EXPOSE 3001
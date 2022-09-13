FROM node:16.x.x
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
COPY .env.local .env
RUN npm run build
CMD ["npm", "run", "start"]
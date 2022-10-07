FROM node:14

WORKDIR /backend-api
COPY package.json .
RUN npm install
COPY . .
CMD npm run dev
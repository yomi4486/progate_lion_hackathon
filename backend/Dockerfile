FROM node:20-alpine3.19
WORKDIR /app
COPY package.json /app
RUN yarn install
COPY . /app
CMD ["yarn", "run", "dev"]
ARG NODE_TAG=22-alpine
FROM node:${NODE_TAG} AS build

WORKDIR /app
COPY ./vue-frontend/package*.json .
RUN npm install -g npm@latest && npm install

FROM node:${NODE_TAG}
WORKDIR /app
COPY ./vue-frontend .
COPY --from=build /app/node_modules ./node_modules
RUN npm install && npm run build
EXPOSE 3000  
CMD ["npm", "run", "dev"]


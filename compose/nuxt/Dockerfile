ARG NODE_TAG=22-alpine
FROM node:${NODE_TAG} AS build

WORKDIR /app
COPY ./vue-frontend/package*.json .
RUN rm -rf node_modules && npm install -g npm@latest && npm install

FROM node:${NODE_TAG}
WORKDIR /app
COPY ./vue-frontend .
COPY --from=build /app/node_modules /node_modules
EXPOSE 3000  
CMD ["npm", "run", "dev"]


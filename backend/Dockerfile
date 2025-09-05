# Common build stage
FROM node:20-alpine as common-build-stage

COPY . ./app

WORKDIR /app

RUN npm install

EXPOSE 8090


# Production build stage
FROM common-build-stage as production-build-stage

ENV NODE_ENV production

CMD ["npm", "run", "start"]

# Development build stage
FROM common-build-stage as development-build-stage

ENV NODE_ENV development

CMD ["npm", "run", "dev"]


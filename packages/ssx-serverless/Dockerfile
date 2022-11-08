FROM node:16 AS build-stage
WORKDIR /ssx-serverless
COPY . .
RUN npm i
RUN npm run build

FROM scratch AS export-stage
COPY --from=build-stage /ssx-serverless/dist/ .

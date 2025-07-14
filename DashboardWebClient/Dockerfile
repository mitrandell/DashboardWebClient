FROM node:20-alpine AS build
WORKDIR /app/src
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build --prod

FROM alpine AS export-stage
WORKDIR /app
COPY --from=build /app/src/dist /static-files
VOLUME /static-export
CMD ["sh", "-c", "cp -r /static-files/* /static-export"]

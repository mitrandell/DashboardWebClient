FROM node:20-alpine AS build
WORKDIR /app/src
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build --prod
CMD ["npm", "run", "start:prod", "--configuration=production","--", "--host", "0.0.0.0"]

EXPOSE 4200

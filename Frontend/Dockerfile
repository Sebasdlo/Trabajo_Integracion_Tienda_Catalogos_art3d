FROM node:slim AS build
WORKDIR /App
COPY package*.json ./
COPY .env .env
RUN npm install
COPY . .
RUN npm run build



FROM nginx:alpine
COPY --from=build /App/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

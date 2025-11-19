FROM node:lts AS build

ARG API_BASEURL=http://localhost:3000
ARG BASE_PATH=/

# Set as environment variable for the build process
ENV API_BASEURL=${API_BASEURL}
ENV BASE_PATH=${BASE_PATH}

WORKDIR /app
COPY ./client/package*.json ./
RUN npm install
COPY ./client .
RUN npm run build

FROM nginx:alpine AS runtime
COPY ./client/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
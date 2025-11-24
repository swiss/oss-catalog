FROM node:lts AS build

ARG API_BASEURL=http://localhost:3000

# Set as environment variable for the build process
ENV API_BASEURL=${API_BASEURL}

WORKDIR /app
COPY ./client/package*.json ./
RUN npm install
COPY ./client .
RUN npm run build

FROM nginx:alpine AS runtime
COPY ./client/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
FROM node:24.15.0 AS build

#ARG API_BASEURL=http://localhost:3000

# Set as environment variable for the build process
ENV API_BASEURL=${API_BASEURL}

WORKDIR /app

RUN corepack enable

COPY ./client/package.json ./
COPY ./client/pnpm-lock.yaml ./
COPY ./pnpm-workspace.yaml ./
RUN pnpm install
COPY ./client .
RUN pnpm build

FROM nginx:alpine AS runtime
COPY ./client/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080

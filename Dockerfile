FROM node:lts AS build

ARG API_BASEURL=http://localhost:3000

# Set as environment variable for the build process
ENV API_BASEURL=${API_BASEURL}

WORKDIR /app

RUN corepack enable

COPY ./client/package.json ./
COPY ./client/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY ./client .
RUN pnpm run build

FROM nginx:alpine AS runtime
COPY ./client/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
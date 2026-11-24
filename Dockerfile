FROM node:26.13.1 AS build

#ARG API_BASEURL=http://localhost:3000

# Set as environment variable for the build process
ENV API_BASEURL=${API_BASEURL}

WORKDIR /app

# corepack is no longer bundled with Node.js >= 25
RUN npm install -g corepack && corepack enable

COPY ./package.json ./pnpm-lock.yaml ./pnpm-workspace.yaml ./
COPY ./client/package.json ./client/
RUN pnpm install --frozen-lockfile
COPY ./client ./client
RUN pnpm scope:client build

FROM nginx:alpine AS runtime
COPY ./client/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/client/dist /usr/share/nginx/html
EXPOSE 8080

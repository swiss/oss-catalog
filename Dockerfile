FROM node:22
WORKDIR /app
COPY ./web .
RUN npm install
CMD ["npm", "start"]

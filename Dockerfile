FROM node:17-alpine
COPY frontend /app/frontend
COPY server /app/server
WORKDIR /app/frontend
RUN npm install && npm run build && cp build/* ../server/public/ -rf
WORKDIR /app/server
RUN npm install
ENV NODE_ENV production
CMD [ "npm", "start" ]
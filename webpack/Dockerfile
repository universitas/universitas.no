FROM node:8.7
COPY ./package.json /app/package.json
WORKDIR /app
RUN mkdir /app/node_modules /var/build && chown node:node /var/build /app/node_modules
USER node
RUN npm install
ENTRYPOINT ["./docker-entrypoint.sh"]

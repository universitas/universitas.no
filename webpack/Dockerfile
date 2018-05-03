FROM node:10
RUN npm --global install npm
COPY ./package.json /app/package.json
WORKDIR /app
RUN mkdir /app/node_modules /var/build && chown node:node /var/build /app /app/node_modules
USER node
RUN npm install
ENTRYPOINT ["./docker-entrypoint.sh"]

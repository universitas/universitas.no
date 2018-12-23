FROM node:11
LABEL maintainer="haakenlid"
ENTRYPOINT ["./docker-entrypoint.sh"]
WORKDIR /app/

RUN npm --global install npm
RUN mkdir /app/node_modules /var/build && chown node:node /var/build /app /app/node_modules
USER node
COPY ./package.json /app/package.json
RUN npm install

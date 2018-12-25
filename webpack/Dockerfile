FROM node:11
LABEL maintainer="haakenlid"
WORKDIR /app/
RUN mkdir /app/node_modules /var/build && chown node:node /var/build /app /app/node_modules
USER node
COPY ./package.json ./package-lock.json /app/
RUN npm ci
ENTRYPOINT ["./docker-entrypoint.sh"]

FROM node:7.4
COPY ./package.json /app/package.json
WORKDIR /app
RUN npm install
RUN mkdir /var/build/ && chown node:node /var/build/
USER node
ENTRYPOINT ["./docker-entrypoint.sh"]

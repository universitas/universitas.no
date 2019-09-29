# parent image is debian with nodejs
FROM node:12
LABEL maintainer="haakenlid"
ENTRYPOINT ["/app/docker-entrypoint.sh"]
WORKDIR /app/

RUN install -o node -g node -d /app/ /var/build/
USER node
COPY ./package.json ./package-lock.json /app/
RUN npm ci && rm package.json package-lock.json

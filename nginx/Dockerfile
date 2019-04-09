FROM pagespeed/nginx-pagespeed:1.13

# make sure nginx can read files created by uid 1000 (whoami)
# remove /etc/nginx/conf.d/default.conf from parent image
RUN apk add --no-cache shadow \
  && addgroup -g1000 www \
  && usermod -aG www nginx \
  && rm -f /etc/nginx/conf.d/* \
  ;

# Copy custom configs for our web app
COPY ./conf.d/* /etc/nginx/conf.d/

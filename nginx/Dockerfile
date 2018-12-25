FROM pagespeed/nginx-pagespeed:1.13

# make sure nginx can read files created by uid 1000 (whoami)
RUN apk add --no-cache shadow \
  && addgroup -g1000 www \
  && usermod -aG www nginx \
  && rm -f /etc/nginx/conf.d/* \
  ; 

# Instead site specific config are placed in `conf.d`
COPY ./conf.d/* /etc/nginx/conf.d/

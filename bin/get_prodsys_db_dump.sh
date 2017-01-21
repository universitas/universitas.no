#!/bin/bash
DUMPFILE=domeneshop_universitas_no_$(date +"%Y-%m-%d").mysql
source "postactivate"

cd "$DJANGO_SOURCE_FOLDER/.."

echo "fetching database dump from domeneshop. Saving as $DUMPFILE"
mysqldump \
  --host=$DJANGO_PRODSYS_DB_HOST \
  --user=$DJANGO_PRODSYS_DB_USER \
  --password=$DJANGO_PRODSYS_DB_PASSWORD \
  $DJANGO_PRODSYS_DB_NAME \
  > $DUMPFILE

echo "updating local mysql database."
mysql \
  --host=localhost \
  --user=$DJANGO_PRODSYS_DB_USER \
  --password=$DJANGO_PRODSYS_DB_PASSWORD \
  $DJANGO_PRODSYS_DB_NAME \
  < $DUMPFILE

echo "update complete."
mv \
 $DUMPFILE \
 prodsys_dump_$(date +"%Y-%m-%d").mysql

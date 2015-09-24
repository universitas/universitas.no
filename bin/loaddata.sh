#!/bin/bash

source $(find_activate_script.sh)

LATEST_DUMP=$(ls -t /srv/*dump*.json | head -n1)

# dump database in json format
# django-admin dumpdata --exclude sessions --exclude watson --indent=2 > /srv/"$DJANGO_DB_NAME"_dump_$(date +"%Y-%m-%d").json
# load database
django-admin loaddata $LATEST_DUMP

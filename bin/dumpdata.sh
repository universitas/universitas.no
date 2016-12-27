#!/bin/bash

# load environmental variables.
source $(find_activate_script.sh)

# dump database in json format
django-admin dumpdata --exclude admin.LogEntry --exclude contenttypes --exclude sessions --exclude watson --indent=2 > /srv/"$DJANGO_DB_NAME"_dump_$(date +"%Y-%m-%d").json

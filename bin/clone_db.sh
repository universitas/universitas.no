#!/bin/bash

ORIGINAL=$1
# load environmental variables.
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
source $DIR/../../venv/**/bin/activate

sudo supervisorctl stop all
sudo -u psql -c "DROP DATABASE IF EXISTS $DJANGO_DB_NAME;"
sudo -u psql -c "CRATE DATABASE $DJANGO_DB_NAME WITH TEMPLATE $ORIGINAL OWNER $DJANGO_DB_USER;"
sudo -u psql -c ""
sudo supervisorctl start all
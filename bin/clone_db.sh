#!/bin/bash

ORIGINAL=$1
# load environmental variables.
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
source $DIR/../../venv/**/bin/activate

sudo supervisorctl stop all
sudo -u postgres psql -c "DROP DATABASE IF EXISTS $DJANGO_DB_NAME;"
sudo -u postgres psql -c "CREATE DATABASE $DJANGO_DB_NAME WITH TEMPLATE $ORIGINAL OWNER $DJANGO_DB_USER;"
sudo -u postgres psql -d $DJANGO_DB_NAME -c "REASSIGN OWNED BY $ORIGINAL TO $DJANGO_DB_USER;"
sudo supervisorctl start all

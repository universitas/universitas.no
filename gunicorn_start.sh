#!/bin/bash

NAME="universitas.no"                                   # Name of the application
VIRTUALENVDIR=/srv/virtual_enviroments/universitas
SOCKFILE=/srv/universitas_project/run/gunicorn.sock  	# we will communicte using this unix socket
DJANGODIR=/srv/universitas_project/universitas_no
# USER=django_user                                        # the user to run as
# GROUP="www-data"                                     		# the group to run as
NUM_WORKERS=3                                     		# how many worker processes should Gunicorn spawn
DJANGO_SETTINGS_MODULE=universitas_no.settings          # which settings file should Django use
DJANGO_WSGI_MODULE=universitas_no.wsgi                  # WSGI module name

echo "Starting $NAME as `whoami`"

# Activate the virtual environment
cd $VIRTUALENVDIR
source ./bin/activate
export DJANGO_SETTINGS_MODULE=$DJANGO_SETTINGS_MODULE
export PYTHONPATH=$DJANGODIR:$PYTHONPATH

# Create the run directory if it doesn't exist
RUNDIR=$(dirname $SOCKFILE)
test -d $RUNDIR || mkdir -p $RUNDIR

# Start your Django Unicorn
# Programs meant to be run under supervisor should not daemonize themselves (do not use --daemon)
exec ./bin/gunicorn ${DJANGO_WSGI_MODULE}:application \
  --name $NAME \
  --workers $NUM_WORKERS \
  --log-level=debug \
  --bind=unix:$SOCKFILE
# --user=$USER --group=$GROUP \

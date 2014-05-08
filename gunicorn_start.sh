#!/bin/bash

NAME="universitas.no"                                   # Name of the application
VIRTUALENVDIR="/srv/virtual_enviroments/universitas/"   # Path to virtual enviroment for the django project
SOCKFILE="/srv/universitas_project/run/gunicorn.sock"   # we will communicte using this unix socket
USER="django_user"                                      # the user to run as
GROUP="www-data"                                        # the group to run as
NUM_WORKERS=3                                           # how many worker processes should Gunicorn spawn
DJANGO_WSGI_MODULE=universitas_no.wsgi                  # WSGI module name

echo "Starting $NAME as `whoami`"
                                                        
# Activate the virtual environment
source $VIRTUALENVDIR/bin/activate
                                                        
# Start your Django Unicorn
# Programs meant to be run under supervisor should not daemonize themselves (do not use --daemon)
exec $VIRTUALENVDIR/bin/gunicorn ${DJANGO_WSGI_MODULE}:application \
  --name $NAME \
  --workers $NUM_WORKERS \
  --bind=unix:$SOCKFILE \
  --user=$USER --group=$GROUP \
  --log-level=debug

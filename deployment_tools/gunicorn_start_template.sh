#!/bin/bash

NAME="SITENAME"
VIRTUALENVDIR="/srv/SITENAME/venv/SITENAME"
SOCKFILE="/tmp/SITENAME.socket"
USER="USERNAME"
GROUP="www-data"
NUM_WORKERS="3"
MAX_REQUESTS="0"

# Activate the virtual environment
source  $VIRTUALENVDIR/bin/activate

# Start your Django Unicorn
# Programs meant to be run under supervisor should not daemonize themselves (do not use --daemon)

exec    $VIRTUALENVDIR/bin/gunicorn \
        $DJANGO_WSGI_MODULE:application \
        --name $NAME \
        --workers $NUM_WORKERS \
        --bind=unix:$SOCKFILE \
        --user=$USER --group=$GROUP \
        --log-level=debug \
        --max-requests=$MAX_REQUESTS

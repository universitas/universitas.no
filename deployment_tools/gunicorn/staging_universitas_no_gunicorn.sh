#!/bin/bash
# Bash script that starts gunicorn worker processes.
# Put in project bin/ folder and keep running with supervisor.

name="staging.universitas.no"
virtualenvfolder="/srv/staging.universitas.no/venv/staging.universitas.no"
socket="/tmp/staging.universitas.no.socket"
user="staging_universitas_no"
group="universitas"
num_workers="3"
max_requests="0"

source  $virtualenvfolder/bin/activate
# Activate the virtual environment


# Start your Django Unicorn
# Programs meant to be run under supervisor should not daemonize themselves (do not use --daemon)

exec    $virtualenvfolder/bin/gunicorn \
        $DJANGO_WSGI_MODULE:application \
        --name $name \
        --workers $num_workers \
        --bind=unix:$socket \
        --user=$user --group=$group \
        --log-level=debug \
        --max-requests=$max_requests

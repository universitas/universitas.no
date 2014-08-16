#!/bin/bash
# Bash script that starts gunicorn worker processes.
# Put in project bin/ folder and keep running with supervisor.

name="dev.universitas.no"
virtualenvfolder="/srv/dev.universitas.no/venv/dev.universitas.no"
socket="/tmp/dev.universitas.no.socket"
user="dev_universitas_no"
group="universitas"
num_workers="3"
max_requests="0"
wsgi="universitas_no.wsgi"

source  $virtualenvfolder/bin/activate
# Activate the virtual environment


# Start your Django Unicorn
# Programs meant to be run under supervisor should not daemonize themselves (do not use --daemon)

exec    $virtualenvfolder/bin/gunicorn \
        $wsgi:application \
        --name $name \
        --workers $num_workers \
        --bind=unix:$socket \
        --user=$user --group=$group \
        --log-level=debug \
        --max-requests=$max_requests

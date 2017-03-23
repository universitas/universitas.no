#!/bin/bash

function run {
  # Start process as unprivileged user
  # Use `exec` to replace original process.
  # This makes it possible for Docker to send signals to the process.
  exec su $(id -nu 1000) -c "$*"
}

case $1 in
  load_db)
    /app/wait-for-it.sh postgres:5432
    run "django-admin reset_db --noinput && django-admin dbshell < dbdump.sql"
    ;;
  migrate)
    run "django-admin makemigrations && django-admin migrate" 
    ;;
  jupyter)
    run "django-admin shell_plus --notebook"
    ;;
  django-admin)
    /app/wait-for-it.sh postgres:5432
    echo "command: $*"
    run "$*"
    ;;
  runserver)
    echo 'starting django runserver'
    run 'django-admin runserver_plus'
    ;;
  uwsgi)
    echo 'starting django uwsgi'
    if [[ $DEBUG -eq 'True' ]]; then
      run 'uwsgi uwsgi.dev.ini'
    else
      run 'uwsgi uwsgi.ini'
    fi
    ;;
  celerybeat)
    echo 'starting celery beat'
    run 'celery beat -A universitas --pidfile= --schedule=/tmp/celerybeat-schedule'
    ;;
  celery)
    echo 'starting celery workers'
    run 'celery worker -A universitas'
    ;;
  *)
    exec "$@"; exit
    ;;
esac


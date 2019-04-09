#!/bin/bash

function run {
  # Start process as unprivileged user
  # Use `exec` to replace original process.
  # This makes it possible for Docker to send signals to the process.
  exec su $(id -nu 1000) -c "$*"
}

case $1 in
  load_db)
    /app/wait-for-it.sh -q postgres:5432
    run "django-admin reset_db --noinput && django-admin dbshell < dbdump.sql"
    ;;
  migrate)
    run "django-admin makemigrations && django-admin migrate"
    ;;
  jupyter)
    run "JUPYTER_DATA_DIR=/app/.jupyter jupyter lab --config='/app/.jupyter/config.py'"
    ;;
  django-admin)
    /app/wait-for-it.sh -q postgres:5432
    run "$*"
    ;;
  runserver)
    echo 'starting django runserver'
    run 'django-admin runserver_plus'
    ;;
  uwsgi)
    echo 'starting django uwsgi'
    mkdir -p /run/fifo/
    chown 1000:1000 /run/fifo/
    if [[ $DEBUG = 'True' ]]; then
      run 'uwsgi uwsgi.dev.ini'
    else
      run 'uwsgi uwsgi.ini'
    fi
    ;;
  celerybeat)
    echo 'starting celery beat'
    run 'celery -A universitas beat --loglevel=INFO --pidfile= --schedule=/tmp/celerybeat-schedule'
    ;;
  celery)
    echo 'starting celery workers'
    run 'celery -A universitas worker --loglevel=INFO'
    ;;
  flower)
    echo 'starting flower'
    run "celery -A universitas flower --loglevel=INFO"
    ;;
  lint)
    shift
    isort --thirdparty django -fss -j3 -m3 -tc $@
    yapf --parallel --verbose --in-place $@
    ;;
  *)
    echo 'just executing'
    exec "$@"
    exit
    ;;
esac


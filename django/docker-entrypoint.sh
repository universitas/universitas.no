#!/bin/bash

function run {
  # Start process as unprivileged user
  # Use `exec` to replace original process.
  # This makes it possible for Docker to send signals to the process.
  exec su $(id -nu 1000) -c "$*"
}

function dump_prodsys_db {
  DUMP=$(date +"prodsys_dump_%d-%m-%Y_%H.%M.%S.sql")
  echo "dumping $PRODSYS_DB_HOST:$PRODSYS_DB_NAME to $DUMP"
  touch $DUMP
  chown 1000:1000 $DUMP
  mysqldump \
  --host=$PRODSYS_DB_HOST \
  --user=$PRODSYS_DB_USER \
  --password=$PRODSYS_DB_PASSWORD \
  $PRODSYS_DB_NAME \
  > $DUMP
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
  dump_prodsys_db)
    dump_prodsys_db
    ;;
  runserver)
    echo 'starting django runserver'
    run 'django-admin runserver_plus'
    ;;
  uwsgi)
    echo 'starting django uwsgi'
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
  *)
    exec "$@"; exit
    ;;
esac


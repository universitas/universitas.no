#!/bin/bash

case $1 in
  build)
    exec npm run build
    ;;
  dev-server)
    exec npm run dev
    ;;
  *)
    exec "$@"
    ;;
esac


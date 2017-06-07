#!/bin/bash

case $1 in
  build)
    exec npm run rebuild
    ;;
  stats)
    exec npm run stats
    ;;
  dev-server)
    exec npm run dev
    ;;
  install)
    [[ $UID == 0 ]] || { echo "must be root" >&2; exit 1; }
    shift
    exec npm install --save $@
    ;;
  *)
    exec "$@"
    ;;
esac


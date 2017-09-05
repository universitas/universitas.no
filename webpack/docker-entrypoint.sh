#!/bin/bash

case $1 in
  jest)
    exec npm run test ;;
  test)
    exec npm run testonce ;;
  build)
    exec npm run rebuild ;;
  stats)
    exec npm run stats ;;
  dev-server)
    exec npm run dev ;;
  install)
    [[ $UID == 0 ]] || { echo "must be root" >&2; exit 1; }
    shift
    exec npm install --save $@
    ;;
  *)
    exec "$@" ;;
esac


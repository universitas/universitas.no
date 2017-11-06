#!/bin/bash

isroot() {
  [[ $UID == 0 ]] && return 0
  echo "must be root" >&2
  exit 1
}

case $1 in
  jest      ) exec npm run test ;;
  test      ) exec npm run testonce ;;
  build     ) exec npm run rebuild ;;
  stats     ) exec npm run stats ;;
  dev-server) exec npm run dev ;;
  install   ) isroot; shift; exec npm install --save $@ ;;
  update    ) isroot; exec npm update --save ;;
  *         ) exec $@ ;;
esac

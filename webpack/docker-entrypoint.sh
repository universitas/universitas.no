#!/bin/bash

case $1 in
  jest      ) exec npm run test ;;
  test      ) exec npm run testonce ;;
  storybook ) exec npm run storybook ;;
  express   ) { test -e ./build/server.bundle.js || npm run buildssr; } && exec npm run serve ;;
  expressdev) npm run watchssr & exec npm run servedev ;;
  expressb  ) exec npm run buildssr ;;
  build     ) exec npm run rebuild ;;
  stats     ) exec npm run stats ;;
  dev-server) exec npm run dev ;;
  install   ) shift; exec npm install --save $@ ;;
  update    ) exec npm update --save ;;
  *         ) exec $@ ;;
esac

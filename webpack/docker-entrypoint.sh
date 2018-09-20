#!/bin/bash

build() {
  rm -rf $BUILD_DIR/*
  npm run buildssr &
  exec npm run build
}

express() {
  [[ -e ./build/server.js ]] || npm run buildssr;
  if [[ $1 == 'dev' ]]; then
    npm run watchssr & 
    exec npm run servedev
  else
    exec npm run serve 
  fi
}


case $1 in
  jest      ) exec npm run test ;;
  test      ) exec npm run testonce ;;
  storybook ) exec npm run storybook ;;
  expressdev) express dev ;;
  express   ) express ;;
  build     ) build ;;
  stats     ) exec npm run stats ;;
  dev-server) exec npm run dev ;;
  install   ) shift; exec npm install --save $@ ;;
  update    ) exec npm update --save ;;
  *         ) exec $@ ;;
esac

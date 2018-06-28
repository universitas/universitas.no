#!/bin/bash

case $1 in
  jest      ) exec npm run test ;;
  test      ) exec npm run testonce ;;
  storybook ) exec npm run storybook ;;
  serve     ) npm run buildssr && exec npm run serve ;; 
  build     ) exec npm run rebuild ;;
  stats     ) exec npm run stats ;;
  dev-server) exec npm run dev ;;
  install   ) shift; exec npm install --save $@ ;;
  update    ) exec npm update --save ;;
  *         ) exec $@ ;;
esac

#!/bin/bash

case $1 in
  jest      ) exec npm run test ;;
  test      ) exec npm run testonce ;;
  storybook ) exec npm run storybook ;;
  build     ) exec npm run rebuild ;;
  stats     ) exec npm run stats ;;
  dev-server) exec npm run dev ;;
  install   ) shift; exec npm install --save $@ ;;
  update    ) exec npm update --save ;;
  *         ) exec $@ ;;
esac

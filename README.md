[![tmb]][travis]
[![lmb]][landscapeM]
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](./LICENSE)

# universitas.no
Source code for the newspaper [universitas.no][universitas] and custom CMS.
Single Page App newspaper and custom CMS for text and photo with a rest api,
integrating print layout workflow with web publishing.

## Backend Stack
- [Django](https://www.djangoproject.com/) Python web framework
- [Django REST Framework](http://www.django-rest-framework.org/) toolkit for building Web APIs
- [Docker](https://www.docker.com/) Software container platform
- [uWSGI](https://uwsgi-docs.readthedocs.io/) Python application server
- [Nginx](http://nginx.org) HTTP and reverse proxy server
- [PostgreSQL](http://www.postgresql.org) Database server
- [OpenCV](http://opencv.org) Computer vision and machine learning software library
- [Celery](http://www.celeryproject.org/) Distributed task queue
- [Redis](http://redis.io) An in-memory data structure store, used as cache
- [RabbitMQ](https://www.rabbitmq.com/) Message broker
- [Pytest](https://docs.pytest.org/en/latest/index.html) Full-featured Python testing tool 

## Frontend Stack
- [React.js](https://reactjs.org/) JavaScript library for building user interfaces
- [Redux](https://redux.js.org/) Predictable state container for JavaScript apps
- [Redux saga](https://redux-saga.js.org/) An alternative side effect model for Redux apps 
- [Redux-First Router](https://github.com/faceyspacey/redux-first-router) Seamless redux-first routing – just dispatch action 
- [Ramda.js](http://ramdajs.com/) A practical functional library for JavaScript
- [Sass](http://sass-lang.com/) CSS extension language and preprocessor
- [Webpack](https://webpack.js.org/) Js and css module bundler
- [Jest](https://jestjs.io/) Delightful JavaScript testing

## Storybooks
React.js [storybooks](https://universitas.github.io/universitas.no/) for the master branch.

## Docker Hub
Our docker containers for frontend (react.js/express), backend(django) and database(postgresql).
https://hub.docker.com/u/universitas/ 

[tmb]:https://travis-ci.org/universitas/universitas.no.svg?branch=master
[tdb]:https://travis-ci.org/universitas/universitas.no.svg?branch=develop
[travis]:https://travis-ci.org/universitas/universitas.no
[lmb]:https://landscape.io/github/universitas/universitas.no/master/landscape.svg?style=flat
[ldb]:https://landscape.io/github/universitas/universitas.no/develop/landscape.svg?style=flat
[landscapeM]:https://landscape.io/github/universitas/universitas.no/master
[landscapeD]:https://landscape.io/github/universitas/universitas.no/develop
[universitas]:http://universitas.no

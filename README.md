[![tmb]][travis]
[![CodeFactor](https://www.codefactor.io/repository/github/universitas/universitas.no/badge)](https://www.codefactor.io/repository/github/universitas/universitas.no)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](./LICENSE)

# universitas.no

Source code for the newspaper [universitas.no][universitas] and custom CMS.
Single Page App newspaper and custom CMS for text and photo with a rest api,
integrating print layout workflow with web publishing.

## Backend Stack

- [Django](https://www.djangoproject.com/) Python web framework
- [Django REST Framework](https://www.django-rest-framework.org/) toolkit for building Web APIs
- [Docker](https://www.docker.com/) Software container platform
- [uWSGI](https://uwsgi-docs.readthedocs.io/en/latest/) Python application server
- [Nginx](https://nginx.org) HTTP and reverse proxy server
- [PostgreSQL](https://www.postgresql.org) Database server
- [OpenCV](https://opencv.org) Computer vision and machine learning software library
- [Celery](http://www.celeryproject.org/) Distributed task queue
- [Redis](https://redis.io) An in-memory data structure store, used as cache
- [RabbitMQ](https://www.rabbitmq.com/) Message broker
- [Pytest](https://docs.pytest.org/en/latest/index.html) Full-featured Python testing tool

## Frontend Stack

- [React.js](https://reactjs.org/) JavaScript library for building user interfaces
- [Redux](https://redux.js.org/) Predictable state container for JavaScript apps
- [Redux saga](https://redux-saga.js.org/) An alternative side effect model for Redux apps
- [Redux-First Router](https://github.com/faceyspacey/redux-first-router) Seamless redux-first routing – just dispatch action
- [Ramda.js](https://ramdajs.com/) A practical functional library for JavaScript
- [Sass](https://sass-lang.com/) CSS extension language and preprocessor
- [Webpack](https://webpack.js.org/) Js and css module bundler
- [Express](https://expressjs.com/) Minimalist web framework for Node.js
- [Jest](https://jestjs.io/) Delightful JavaScript testing

## Storybooks

[storybooks](https://universitas.github.io/universitas.no/) demos of some of the
react components.

## Docker Hub

Our docker containers for frontend (react.js/express), backend(django) and database(postgresql).
https://hub.docker.com/u/universitas/

[tmb]: https://travis-ci.org/universitas/universitas.no.svg?branch=master
[tdb]: https://travis-ci.org/universitas/universitas.no.svg?branch=develop
[travis]: https://travis-ci.org/universitas/universitas.no
[universitas]: https://universitas.no

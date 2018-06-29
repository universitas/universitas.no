/******/ ;(function(modules) {
  // webpackBootstrap
  /******/ // The module cache
  /******/ var installedModules = {} // The require function
  /******/
  /******/ /******/ function __webpack_require__(moduleId) {
    /******/
    /******/ // Check if module is in cache
    /******/ if (installedModules[moduleId]) {
      /******/ return installedModules[moduleId].exports
      /******/
    } // Create a new module (and put it into the cache)
    /******/ /******/ var module = (installedModules[moduleId] = {
      /******/ i: moduleId,
      /******/ l: false,
      /******/ exports: {},
      /******/
    }) // Execute the module function
    /******/
    /******/ /******/ modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__,
    ) // Flag the module as loaded
    /******/
    /******/ /******/ module.l = true // Return the exports of the module
    /******/
    /******/ /******/ return module.exports
    /******/
  } // expose the modules object (__webpack_modules__)
  /******/
  /******/
  /******/ /******/ __webpack_require__.m = modules // expose the module cache
  /******/
  /******/ /******/ __webpack_require__.c = installedModules // define getter function for harmony exports
  /******/
  /******/ /******/ __webpack_require__.d = function(exports, name, getter) {
    /******/ if (!__webpack_require__.o(exports, name)) {
      /******/ Object.defineProperty(exports, name, {
        enumerable: true,
        get: getter,
      })
      /******/
    }
    /******/
  } // define __esModule on exports
  /******/
  /******/ /******/ __webpack_require__.r = function(exports) {
    /******/ if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      /******/ Object.defineProperty(exports, Symbol.toStringTag, {
        value: 'Module',
      })
      /******/
    }
    /******/ Object.defineProperty(exports, '__esModule', { value: true })
    /******/
  } // create a fake namespace object // mode & 1: value is a module id, require it // mode & 2: merge all properties of value into the ns // mode & 4: return value when already ns object // mode & 8|1: behave like require
  /******/
  /******/ /******/ /******/ /******/ /******/ /******/ __webpack_require__.t = function(
    value,
    mode,
  ) {
    /******/ if (mode & 1) value = __webpack_require__(value)
    /******/ if (mode & 8) return value
    /******/ if (
      mode & 4 &&
      typeof value === 'object' &&
      value &&
      value.__esModule
    )
      return value
    /******/ var ns = Object.create(null)
    /******/ __webpack_require__.r(ns)
    /******/ Object.defineProperty(ns, 'default', {
      enumerable: true,
      value: value,
    })
    /******/ if (mode & 2 && typeof value != 'string')
      for (var key in value)
        __webpack_require__.d(
          ns,
          key,
          function(key) {
            return value[key]
          }.bind(null, key),
        )
    /******/ return ns
    /******/
  } // getDefaultExport function for compatibility with non-harmony modules
  /******/
  /******/ /******/ __webpack_require__.n = function(module) {
    /******/ var getter =
      module && module.__esModule
        ? /******/ function getDefault() {
            return module['default']
          }
        : /******/ function getModuleExports() {
            return module
          }
    /******/ __webpack_require__.d(getter, 'a', getter)
    /******/ return getter
    /******/
  } // Object.prototype.hasOwnProperty.call
  /******/
  /******/ /******/ __webpack_require__.o = function(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property)
  } // __webpack_public_path__
  /******/
  /******/ /******/ __webpack_require__.p = '' // Load entry module and return exports
  /******/
  /******/
  /******/ /******/ return __webpack_require__(
    (__webpack_require__.s = './src/entrypoints/server.js'),
  )
  /******/
})(
  /************************************************************************/
  /******/ {
    /***/ /*!*******************************************!*\
  !*** (webpack)/buildin/harmony-module.js ***!
  \*******************************************/
    /*! no static exports found */
    /***/ './node_modules/webpack/buildin/harmony-module.js': function(
      module,
      exports,
    ) {
      module.exports = function(originalModule) {
        if (!originalModule.webpackPolyfill) {
          var module = Object.create(originalModule)
          // module.parent = undefined by default
          if (!module.children) module.children = []
          Object.defineProperty(module, 'loaded', {
            enumerable: true,
            get: function() {
              return module.l
            },
          })
          Object.defineProperty(module, 'id', {
            enumerable: true,
            get: function() {
              return module.i
            },
          })
          Object.defineProperty(module, 'exports', {
            enumerable: true,
          })
          module.webpackPolyfill = 1
        }
        return module
      }

      /***/
    },

    /***/ /*!********************************************!*\
  !*** ./src/entrypoints/Universitas/App.js ***!
  \********************************************/
    /*! exports provided: default */
    /***/ './src/entrypoints/Universitas/App.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module, React) {
        /* harmony import */ var react_hot_loader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! react-hot-loader */ 'react-hot-loader',
        )
        /* harmony import */ var react_hot_loader__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
          react_hot_loader__WEBPACK_IMPORTED_MODULE_0__,
        )
        /* harmony import */ var styles_universitas_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! styles/universitas.scss */ './src/react/styles/universitas.scss',
        )
        /* harmony import */ var styles_universitas_scss__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(
          styles_universitas_scss__WEBPACK_IMPORTED_MODULE_1__,
        )
        /* harmony import */ var components_TopMenu__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          /*! components/TopMenu */ './src/react/components/TopMenu/index.js',
        )
        /* harmony import */ var components_PageSwitch__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
          /*! components/PageSwitch */ './src/react/components/PageSwitch.js',
        )
        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        function _objectDestructuringEmpty(obj) {
          if (obj == null) throw new TypeError('Cannot destructure undefined')
        }

        setTimeout(function() {
          console.assert(
            typeof react_hot_loader__WEBPACK_IMPORTED_MODULE_0__['hot'] !==
              'undefined',
            '[IMPORT]:',
            'hot',
            'from',
            'react-hot-loader',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof components_TopMenu__WEBPACK_IMPORTED_MODULE_2__[
              'default'
            ] !== 'undefined',
            '[IMPORT]:',
            'TopMenu',
            'from',
            'components/TopMenu',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof components_PageSwitch__WEBPACK_IMPORTED_MODULE_3__[
              'default'
            ] !== 'undefined',
            '[IMPORT]:',
            'PageSwitch',
            'from',
            'components/PageSwitch',
            'is undefined.',
          )
        }, 0)
        var App = function App(_ref) {
          _objectDestructuringEmpty(_ref)

          return React.createElement(
            'div',
            { className: 'Universitas' },
            React.createElement(
              components_TopMenu__WEBPACK_IMPORTED_MODULE_2__['default'],
              null,
            ),
            React.createElement(
              components_PageSwitch__WEBPACK_IMPORTED_MODULE_3__['default'],
              null,
            ),
          )
        }

        var _default = Object(
          react_hot_loader__WEBPACK_IMPORTED_MODULE_0__['hot'],
        )(module)(App)

        /* harmony default export */ __webpack_exports__['default'] = _default
        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            App,
            'App',
            '/app/src/entrypoints/Universitas/App.js',
          )
          reactHotLoader.register(
            _default,
            'default',
            '/app/src/entrypoints/Universitas/App.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
        __webpack_require__(/*! react */ 'react'),
      ))

      /***/
    },

    /***/ /*!*******************************************************!*\
  !*** ./src/entrypoints/Universitas/configureStore.js ***!
  \*******************************************************/
    /*! exports provided: default */
    /***/ './src/entrypoints/Universitas/configureStore.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module) {
        /* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! redux */ 'redux',
        )
        /* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
          redux__WEBPACK_IMPORTED_MODULE_0__,
        )
        /* harmony import */ var redux_first_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! redux-first-router */ 'redux-first-router',
        )
        /* harmony import */ var redux_first_router__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(
          redux_first_router__WEBPACK_IMPORTED_MODULE_1__,
        )
        /* harmony import */ var utils_misc__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          /*! utils/misc */ './src/react/utils/misc.js',
        )
        /* harmony import */ var redux_saga__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
          /*! redux-saga */ 'redux-saga',
        )
        /* harmony import */ var redux_saga__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/ __webpack_require__.n(
          redux_saga__WEBPACK_IMPORTED_MODULE_3__,
        )
        /* harmony import */ var _reducers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
          /*! ./reducers */ './src/entrypoints/Universitas/reducers.js',
        )
        /* harmony import */ var _saga__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
          /*! ./saga */ './src/entrypoints/Universitas/saga.js',
        )
        /* harmony import */ var ducks_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
          /*! ducks/router */ './src/react/ducks/router.js',
        )
        var _extends =
          Object.assign ||
          function(target) {
            for (var i = 1; i < arguments.length; i++) {
              var source = arguments[i]
              for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                  target[key] = source[key]
                }
              }
            }
            return target
          }

        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        setTimeout(function() {
          console.assert(
            typeof redux__WEBPACK_IMPORTED_MODULE_0__['combineReducers'] !==
              'undefined',
            '[IMPORT]:',
            'combineReducers',
            'from',
            'redux',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof redux__WEBPACK_IMPORTED_MODULE_0__['applyMiddleware'] !==
              'undefined',
            '[IMPORT]:',
            'applyMiddleware',
            'from',
            'redux',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof redux__WEBPACK_IMPORTED_MODULE_0__['createStore'] !==
              'undefined',
            '[IMPORT]:',
            'createStore',
            'from',
            'redux',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof redux_first_router__WEBPACK_IMPORTED_MODULE_1__[
              'connectRoutes'
            ] !== 'undefined',
            '[IMPORT]:',
            'connectRoutes',
            'from',
            'redux-first-router',
            'is undefined.',
          )
        }, 0)
        // use devtools if available
        setTimeout(function() {
          console.assert(
            typeof utils_misc__WEBPACK_IMPORTED_MODULE_2__['compose'] !==
              'undefined',
            '[IMPORT]:',
            'compose',
            'from',
            'utils/misc',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof redux_saga__WEBPACK_IMPORTED_MODULE_3___default.a !==
              'undefined',
            '[IMPORT]:',
            'createSagaMiddleware',
            'from',
            'redux-saga',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof _reducers__WEBPACK_IMPORTED_MODULE_4__ !== 'undefined',
            '[IMPORT]:',
            'reducers',
            'from',
            './reducers',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof _saga__WEBPACK_IMPORTED_MODULE_5__['default'] !==
              'undefined',
            '[IMPORT]:',
            'rootSaga',
            'from',
            './saga',
            'is undefined.',
          )
        }, 0)

        // creates a redux store with hot reloaded reducer and redux-saga
        setTimeout(function() {
          console.assert(
            typeof ducks_router__WEBPACK_IMPORTED_MODULE_6__[
              'routerOptions'
            ] !== 'undefined',
            '[IMPORT]:',
            'routerOptions',
            'from',
            'ducks/router',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof ducks_router__WEBPACK_IMPORTED_MODULE_6__['routesMap'] !==
              'undefined',
            '[IMPORT]:',
            'routesMap',
            'from',
            'ducks/router',
            'is undefined.',
          )
        }, 0)
        var configureStore = function configureStore() {
          var initialState =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : {}
          var initialEntries =
            arguments.length > 1 && arguments[1] !== undefined
              ? arguments[1]
              : []

          var sagaMiddleware = redux_saga__WEBPACK_IMPORTED_MODULE_3___default()()
          var router = Object(
            redux_first_router__WEBPACK_IMPORTED_MODULE_1__['connectRoutes'],
          )(
            ducks_router__WEBPACK_IMPORTED_MODULE_6__['routesMap'],
            _extends(
              {},
              ducks_router__WEBPACK_IMPORTED_MODULE_6__['routerOptions'],
              {
                initialEntries: initialEntries,
              },
            ),
          )
          var middlewares = Object(
            utils_misc__WEBPACK_IMPORTED_MODULE_2__['compose'],
          )(
            router.enhancer,
            Object(redux__WEBPACK_IMPORTED_MODULE_0__['applyMiddleware'])(
              router.middleware,
              sagaMiddleware,
            ),
          )
          var rootReducer = Object(
            redux__WEBPACK_IMPORTED_MODULE_0__['combineReducers'],
          )(
            _extends(
              { location: router.reducer },
              _reducers__WEBPACK_IMPORTED_MODULE_4__,
            ),
          )
          var store = Object(redux__WEBPACK_IMPORTED_MODULE_0__['createStore'])(
            rootReducer,
            initialState,
            middlewares,
          )
          console.log(process.env.TARGET)
          if (process.env.TARGET == 'server') return store
          var sagaTask = sagaMiddleware.run(
            _saga__WEBPACK_IMPORTED_MODULE_5__['default'],
          ) // start sagas
          if (false) {
          }
          return store
        }

        var _default = configureStore
        /* harmony default export */ __webpack_exports__['default'] = _default
        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            configureStore,
            'configureStore',
            '/app/src/entrypoints/Universitas/configureStore.js',
          )
          reactHotLoader.register(
            _default,
            'default',
            '/app/src/entrypoints/Universitas/configureStore.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
      ))

      /***/
    },

    /***/ /*!*************************************************!*\
  !*** ./src/entrypoints/Universitas/reducers.js ***!
  \*************************************************/
    /*! exports provided: newsFeed, site, publicstory, issues */
    /***/ './src/entrypoints/Universitas/reducers.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* harmony import */ var ducks_newsFeed__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
        /*! ducks/newsFeed */ './src/react/ducks/newsFeed.js',
      )
      /* harmony reexport (safe) */ __webpack_require__.d(
        __webpack_exports__,
        'newsFeed',
        function() {
          return ducks_newsFeed__WEBPACK_IMPORTED_MODULE_0__['default']
        },
      )

      /* harmony import */ var ducks_site__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
        /*! ducks/site */ './src/react/ducks/site.js',
      )
      /* harmony reexport (safe) */ __webpack_require__.d(
        __webpack_exports__,
        'site',
        function() {
          return ducks_site__WEBPACK_IMPORTED_MODULE_1__['default']
        },
      )

      /* harmony import */ var ducks_issues__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
        /*! ducks/issues */ './src/react/ducks/issues.js',
      )
      /* harmony reexport (safe) */ __webpack_require__.d(
        __webpack_exports__,
        'issues',
        function() {
          return ducks_issues__WEBPACK_IMPORTED_MODULE_2__['default']
        },
      )

      /* harmony import */ var ducks_publicstory__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
        /*! ducks/publicstory */ './src/react/ducks/publicstory.js',
      )
      /* harmony reexport (safe) */ __webpack_require__.d(
        __webpack_exports__,
        'publicstory',
        function() {
          return ducks_publicstory__WEBPACK_IMPORTED_MODULE_3__['default']
        },
      )

      setTimeout(function() {
        console.assert(
          typeof ducks_newsFeed__WEBPACK_IMPORTED_MODULE_0__['default'] !==
            'undefined',
          '[IMPORT]:',
          'newsFeed',
          'from',
          'ducks/newsFeed',
          'is undefined.',
        )
      }, 0)

      setTimeout(function() {
        console.assert(
          typeof ducks_site__WEBPACK_IMPORTED_MODULE_1__['default'] !==
            'undefined',
          '[IMPORT]:',
          'site',
          'from',
          'ducks/site',
          'is undefined.',
        )
      }, 0)

      setTimeout(function() {
        console.assert(
          typeof ducks_issues__WEBPACK_IMPORTED_MODULE_2__['default'] !==
            'undefined',
          '[IMPORT]:',
          'issues',
          'from',
          'ducks/issues',
          'is undefined.',
        )
      }, 0)

      setTimeout(function() {
        console.assert(
          typeof ducks_publicstory__WEBPACK_IMPORTED_MODULE_3__['default'] !==
            'undefined',
          '[IMPORT]:',
          'publicstory',
          'from',
          'ducks/publicstory',
          'is undefined.',
        )
      }, 0)

      /***/
    },

    /***/ /*!*********************************************!*\
  !*** ./src/entrypoints/Universitas/saga.js ***!
  \*********************************************/
    /*! exports provided: default */
    /***/ './src/entrypoints/Universitas/saga.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module) {
        /* harmony import */ var sagas_frontPageSaga__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! sagas/frontPageSaga */ './src/react/sagas/frontPageSaga.js',
        )
        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        setTimeout(function() {
          console.assert(
            typeof sagas_frontPageSaga__WEBPACK_IMPORTED_MODULE_0__[
              'default'
            ] !== 'undefined',
            '[IMPORT]:',
            'rootSaga',
            'from',
            'sagas/frontPageSaga',
            'is undefined.',
          )
        }, 0)
        var _default =
          sagas_frontPageSaga__WEBPACK_IMPORTED_MODULE_0__['default']
        /* harmony default export */ __webpack_exports__['default'] = _default
        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            _default,
            'default',
            '/app/src/entrypoints/Universitas/saga.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
      ))

      /***/
    },

    /***/ /*!***********************************!*\
  !*** ./src/entrypoints/server.js ***!
  \***********************************/
    /*! no exports provided */
    /***/ './src/entrypoints/server.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module) {
        /* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! express */ 'express',
        )
        /* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
          express__WEBPACK_IMPORTED_MODULE_0__,
        )
        /* harmony import */ var morgan__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! morgan */ 'morgan',
        )
        /* harmony import */ var morgan__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(
          morgan__WEBPACK_IMPORTED_MODULE_1__,
        )
        /* harmony import */ var _serverRender__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          /*! ./serverRender */ './src/entrypoints/serverRender.js',
        )
        var _extends =
          Object.assign ||
          function(target) {
            for (var i = 1; i < arguments.length; i++) {
              var source = arguments[i]
              for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                  target[key] = source[key]
                }
              }
            }
            return target
          }

        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        // express server

        setTimeout(function() {
          console.assert(
            typeof express__WEBPACK_IMPORTED_MODULE_0___default.a !==
              'undefined',
            '[IMPORT]:',
            'express',
            'from',
            'express',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof morgan__WEBPACK_IMPORTED_MODULE_1___default.a !==
              'undefined',
            '[IMPORT]:',
            'morgan',
            'from',
            'morgan',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof _serverRender__WEBPACK_IMPORTED_MODULE_2__['default'] !==
              'undefined',
            '[IMPORT]:',
            'render',
            'from',
            './serverRender',
            'is undefined.',
          )
        }, 0)
        var PORT = process.env.NODE_PORT || 9000

        var handleRender = function handleRender(req, res) {
          var actions = req.body
          var url = req.url
          var result = Object(
            _serverRender__WEBPACK_IMPORTED_MODULE_2__['default'],
          )(url, actions)
          // const data = { location: result.state.location }
          // console.log(JSON.stringify(data, null, 2))
          res.json(_extends({ url: url }, result))
        }

        var app = express__WEBPACK_IMPORTED_MODULE_0___default()()
        app.use(
          express__WEBPACK_IMPORTED_MODULE_0___default.a.json({
            limit: '10mb',
          }),
        )
        app.set('json spaces', 2)
        app.use(morgan__WEBPACK_IMPORTED_MODULE_1___default()('combined'))
        app.get(/\.ico$/, function(req, res) {
          return res.status(404).send()
        })
        app.use(handleRender)
        app.listen(PORT, function() {
          return console.log('listening on port ' + PORT)
        })
        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            PORT,
            'PORT',
            '/app/src/entrypoints/server.js',
          )
          reactHotLoader.register(
            handleRender,
            'handleRender',
            '/app/src/entrypoints/server.js',
          )
          reactHotLoader.register(app, 'app', '/app/src/entrypoints/server.js')
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
      ))

      /***/
    },

    /***/ /*!*****************************************!*\
  !*** ./src/entrypoints/serverRender.js ***!
  \*****************************************/
    /*! exports provided: default */
    /***/ './src/entrypoints/serverRender.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module, R, React) {
        /* harmony import */ var babel_polyfill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! babel-polyfill */ 'babel-polyfill',
        )
        /* harmony import */ var babel_polyfill__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
          babel_polyfill__WEBPACK_IMPORTED_MODULE_0__,
        )
        /* harmony import */ var react_helmet__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! react-helmet */ 'react-helmet',
        )
        /* harmony import */ var react_helmet__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(
          react_helmet__WEBPACK_IMPORTED_MODULE_1__,
        )
        /* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          /*! react-redux */ 'react-redux',
        )
        /* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/ __webpack_require__.n(
          react_redux__WEBPACK_IMPORTED_MODULE_2__,
        )
        /* harmony import */ var react_dom_server__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
          /*! react-dom/server */ 'react-dom/server',
        )
        /* harmony import */ var react_dom_server__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/ __webpack_require__.n(
          react_dom_server__WEBPACK_IMPORTED_MODULE_3__,
        )
        /* harmony import */ var _Universitas_App__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
          /*! ./Universitas/App */ './src/entrypoints/Universitas/App.js',
        )
        /* harmony import */ var _Universitas_configureStore_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
          /*! ./Universitas/configureStore.js */ './src/entrypoints/Universitas/configureStore.js',
        )
        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        // Server side rendering of frontpage

        setTimeout(function() {
          console.assert(
            typeof react_helmet__WEBPACK_IMPORTED_MODULE_1__['Helmet'] !==
              'undefined',
            '[IMPORT]:',
            'Helmet',
            'from',
            'react-helmet',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof react_redux__WEBPACK_IMPORTED_MODULE_2__['Provider'] !==
              'undefined',
            '[IMPORT]:',
            'Provider',
            'from',
            'react-redux',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof react_dom_server__WEBPACK_IMPORTED_MODULE_3__[
              'renderToString'
            ] !== 'undefined',
            '[IMPORT]:',
            'renderToString',
            'from',
            'react-dom/server',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof _Universitas_App__WEBPACK_IMPORTED_MODULE_4__['default'] !==
              'undefined',
            '[IMPORT]:',
            'App',
            'from',
            './Universitas/App',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof _Universitas_configureStore_js__WEBPACK_IMPORTED_MODULE_5__[
              'default'
            ] !== 'undefined',
            '[IMPORT]:',
            'configureStore',
            'from',
            './Universitas/configureStore.js',
            'is undefined.',
          )
        }, 0)
        var headers = function headers() {
          var helmet = react_helmet__WEBPACK_IMPORTED_MODULE_1__[
            'Helmet'
          ].renderStatic()
          return R.unless(
            R.is(String),
            R.map(function(attr) {
              return attr.toString()
            }),
            helmet,
          )
        }

        var notFetching = R.map(
          R.cond([
            [R.has('fetching'), R.assoc('fetching', false)],
            [
              R.is(Array),
              function(a) {
                return R.map(notFetching, a)
              },
            ],
            [R.T, R.identity],
          ]),
        )

        var _default = function _default(url) {
          var actions =
            arguments.length > 1 && arguments[1] !== undefined
              ? arguments[1]
              : []

          var store = Object(
            _Universitas_configureStore_js__WEBPACK_IMPORTED_MODULE_5__[
              'default'
            ],
          )(undefined, url)
          global.location = { href: 'http://universitas.no' + url }
          R.forEach(function(action) {
            return store.dispatch(action)
          }, actions)
          var html = Object(
            react_dom_server__WEBPACK_IMPORTED_MODULE_3__['renderToString'],
          )(
            React.createElement(
              react_redux__WEBPACK_IMPORTED_MODULE_2__['Provider'],
              { store: store },
              React.createElement(
                _Universitas_App__WEBPACK_IMPORTED_MODULE_4__['default'],
                null,
              ),
            ),
          )
          return {
            html: html,
            state: notFetching(store.getState()),
            headers: headers(),
          }
        }

        /* harmony default export */ __webpack_exports__['default'] = _default
        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            headers,
            'headers',
            '/app/src/entrypoints/serverRender.js',
          )
          reactHotLoader.register(
            notFetching,
            'notFetching',
            '/app/src/entrypoints/serverRender.js',
          )
          reactHotLoader.register(
            _default,
            'default',
            '/app/src/entrypoints/serverRender.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
        __webpack_require__(/*! ramda */ 'ramda'),
        __webpack_require__(/*! react */ 'react'),
      ))

      /***/
    },

    /***/ /*!**********************************!*\
  !*** ./src/images/modulkart.png ***!
  \**********************************/
    /*! no static exports found */
    /***/ './src/images/modulkart.png': function(
      module,
      exports,
      __webpack_require__,
    ) {
      module.exports =
        __webpack_require__.p + 'assets/modulkart-ee3ae499cdfc.png'

      /***/
    },

    /***/ /*!****************************************!*\
  !*** ./src/images/modulkart_liten.png ***!
  \****************************************/
    /*! no static exports found */
    /***/ './src/images/modulkart_liten.png': function(
      module,
      exports,
      __webpack_require__,
    ) {
      module.exports =
        __webpack_require__.p + 'assets/modulkart_liten-ad6e5eb96d09.png'

      /***/
    },

    /***/ /*!*********************************************************!*\
  !*** ./src/react/components/ContactCard/ContactCard.js ***!
  \*********************************************************/
    /*! exports provided: default */
    /***/ './src/react/components/ContactCard/ContactCard.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module, React) {
        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        var ContactCard = function ContactCard(_ref) {
          var id = _ref.id,
            position = _ref.position,
            display_name = _ref.display_name,
            phone = _ref.phone,
            email = _ref.email,
            thumb = _ref.thumb
          return React.createElement(
            'div',
            { className: 'ContactCard', key: id },
            React.createElement('img', {
              className: 'thumb',
              src: thumb,
              alt: display_name,
            }),
            React.createElement('div', { className: 'position' }, position),
            React.createElement('div', { className: 'name' }, display_name),
            React.createElement('div', { className: 'phone' }, phone),
            React.createElement('div', { className: 'email' }, email),
          )
        }

        var _default = ContactCard
        /* harmony default export */ __webpack_exports__['default'] = _default
        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            ContactCard,
            'ContactCard',
            '/app/src/react/components/ContactCard/ContactCard.js',
          )
          reactHotLoader.register(
            _default,
            'default',
            '/app/src/react/components/ContactCard/ContactCard.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
        __webpack_require__(/*! react */ 'react'),
      ))

      /***/
    },

    /***/ /*!***********************************************************!*\
  !*** ./src/react/components/ContactCard/ContactCard.scss ***!
  \***********************************************************/
    /*! no static exports found */
    /***/ './src/react/components/ContactCard/ContactCard.scss': function(
      module,
      exports,
    ) {
      // empty (null-loader)
      /***/
    },

    /***/ /*!***************************************************!*\
  !*** ./src/react/components/ContactCard/index.js ***!
  \***************************************************/
    /*! exports provided: default */
    /***/ './src/react/components/ContactCard/index.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module) {
        /* harmony import */ var _ContactCard_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! ./ContactCard.scss */ './src/react/components/ContactCard/ContactCard.scss',
        )
        /* harmony import */ var _ContactCard_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
          _ContactCard_scss__WEBPACK_IMPORTED_MODULE_0__,
        )
        /* harmony import */ var _ContactCard_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! ./ContactCard.js */ './src/react/components/ContactCard/ContactCard.js',
        )
        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        setTimeout(function() {
          console.assert(
            typeof _ContactCard_js__WEBPACK_IMPORTED_MODULE_1__['default'] !==
              'undefined',
            '[IMPORT]:',
            'ContactCard',
            'from',
            './ContactCard.js',
            'is undefined.',
          )
        }, 0)
        var _default = _ContactCard_js__WEBPACK_IMPORTED_MODULE_1__['default']
        /* harmony default export */ __webpack_exports__['default'] = _default
        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            _default,
            'default',
            '/app/src/react/components/ContactCard/index.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
      ))

      /***/
    },

    /***/ /*!***************************************!*\
  !*** ./src/react/components/Debug.js ***!
  \***************************************/
    /*! exports provided: default */
    /***/ './src/react/components/Debug.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module, React) {
        /* harmony import */ var utils_text__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! utils/text */ './src/react/utils/text.js',
        )
        /* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! classnames */ 'classnames',
        )
        /* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(
          classnames__WEBPACK_IMPORTED_MODULE_1__,
        )
        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        setTimeout(function() {
          console.assert(
            typeof utils_text__WEBPACK_IMPORTED_MODULE_0__['toJson'] !==
              'undefined',
            '[IMPORT]:',
            'toJson',
            'from',
            'utils/text',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof classnames__WEBPACK_IMPORTED_MODULE_1___default.a !==
              'undefined',
            '[IMPORT]:',
            'cx',
            'from',
            'classnames',
            'is undefined.',
          )
        }, 0)
        var Debug = function Debug(props) {
          return React.createElement(
            'div',
            {
              className: classnames__WEBPACK_IMPORTED_MODULE_1___default()(
                'Debug',
                props.className,
              ),
              style: {
                background: '#010',
                borderRadius: '0.5em',
                color: '#af5',
                padding: '0.5em',
                fontFamily: 'monospace',
                fontSize: '0.7rem',
                lineHeight: 1.1,
                whiteSpace: 'pre-wrap',
                flex: 1,
                overflowY: 'auto',
              },
            },
            Object(utils_text__WEBPACK_IMPORTED_MODULE_0__['toJson'])(props),
          )
        }

        var _default = Debug
        /* harmony default export */ __webpack_exports__['default'] = _default
        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            Debug,
            'Debug',
            '/app/src/react/components/Debug.js',
          )
          reactHotLoader.register(
            _default,
            'default',
            '/app/src/react/components/Debug.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
        __webpack_require__(/*! react */ 'react'),
      ))

      /***/
    },

    /***/ /*!***************************************!*\
  !*** ./src/react/components/Icons.js ***!
  \***************************************/
    /*! exports provided: Add, Announce, ArtTrack, Aside, BulletList, Camera, CameraRoll, Clear, Close, Comment, Crop, Delete, Description, Done, Download, Edit, Email, Error, Eye, Fallback, FileUpload, Forward, GridView, Heading, Info, Laptop, ListView, Link, Loop, Magic, Menu, Newspaper, Pdf, Person, Phone, Question, Quote, Search, Sync, TextFields, Time, Transform, Tune */
    /***/ './src/react/components/Icons.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* harmony import */ var react_icons_lib_md_add_circle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
        /*! react-icons/lib/md/add-circle */ 'react-icons/lib/md/add-circle',
      )
      /* harmony import */ var react_icons_lib_md_add_circle__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
        react_icons_lib_md_add_circle__WEBPACK_IMPORTED_MODULE_0__,
      )
      /* harmony reexport (default from non-harmony) */ __webpack_require__.d(
        __webpack_exports__,
        'Add',
        function() {
          return react_icons_lib_md_add_circle__WEBPACK_IMPORTED_MODULE_0___default.a
        },
      )
      /* harmony import */ var react_icons_lib_md_announcement__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
        /*! react-icons/lib/md/announcement */ 'react-icons/lib/md/announcement',
      )
      /* harmony import */ var react_icons_lib_md_announcement__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(
        react_icons_lib_md_announcement__WEBPACK_IMPORTED_MODULE_1__,
      )
      /* harmony reexport (default from non-harmony) */ __webpack_require__.d(
        __webpack_exports__,
        'Announce',
        function() {
          return react_icons_lib_md_announcement__WEBPACK_IMPORTED_MODULE_1___default.a
        },
      )
      /* harmony import */ var react_icons_lib_md_art_track__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
        /*! react-icons/lib/md/art-track */ 'react-icons/lib/md/art-track',
      )
      /* harmony import */ var react_icons_lib_md_art_track__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/ __webpack_require__.n(
        react_icons_lib_md_art_track__WEBPACK_IMPORTED_MODULE_2__,
      )
      /* harmony reexport (default from non-harmony) */ __webpack_require__.d(
        __webpack_exports__,
        'ArtTrack',
        function() {
          return react_icons_lib_md_art_track__WEBPACK_IMPORTED_MODULE_2___default.a
        },
      )
      /* harmony import */ var react_icons_lib_md_subject__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
        /*! react-icons/lib/md/subject */ 'react-icons/lib/md/subject',
      )
      /* harmony import */ var react_icons_lib_md_subject__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/ __webpack_require__.n(
        react_icons_lib_md_subject__WEBPACK_IMPORTED_MODULE_3__,
      )
      /* harmony reexport (default from non-harmony) */ __webpack_require__.d(
        __webpack_exports__,
        'Aside',
        function() {
          return react_icons_lib_md_subject__WEBPACK_IMPORTED_MODULE_3___default.a
        },
      )
      /* harmony import */ var react_icons_lib_md_format_list_bulleted__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
        /*! react-icons/lib/md/format-list-bulleted */ 'react-icons/lib/md/format-list-bulleted',
      )
      /* harmony import */ var react_icons_lib_md_format_list_bulleted__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/ __webpack_require__.n(
        react_icons_lib_md_format_list_bulleted__WEBPACK_IMPORTED_MODULE_4__,
      )
      /* harmony reexport (default from non-harmony) */ __webpack_require__.d(
        __webpack_exports__,
        'BulletList',
        function() {
          return react_icons_lib_md_format_list_bulleted__WEBPACK_IMPORTED_MODULE_4___default.a
        },
      )
      /* harmony import */ var react_icons_lib_md_photo_camera__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
        /*! react-icons/lib/md/photo-camera */ 'react-icons/lib/md/photo-camera',
      )
      /* harmony import */ var react_icons_lib_md_photo_camera__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/ __webpack_require__.n(
        react_icons_lib_md_photo_camera__WEBPACK_IMPORTED_MODULE_5__,
      )
      /* harmony reexport (default from non-harmony) */ __webpack_require__.d(
        __webpack_exports__,
        'Camera',
        function() {
          return react_icons_lib_md_photo_camera__WEBPACK_IMPORTED_MODULE_5___default.a
        },
      )
      /* harmony import */ var react_icons_lib_md_camera_roll__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
        /*! react-icons/lib/md/camera-roll */ 'react-icons/lib/md/camera-roll',
      )
      /* harmony import */ var react_icons_lib_md_camera_roll__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/ __webpack_require__.n(
        react_icons_lib_md_camera_roll__WEBPACK_IMPORTED_MODULE_6__,
      )
      /* harmony reexport (default from non-harmony) */ __webpack_require__.d(
        __webpack_exports__,
        'CameraRoll',
        function() {
          return react_icons_lib_md_camera_roll__WEBPACK_IMPORTED_MODULE_6___default.a
        },
      )
      /* harmony import */ var react_icons_lib_md_clear__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
        /*! react-icons/lib/md/clear */ 'react-icons/lib/md/clear',
      )
      /* harmony import */ var react_icons_lib_md_clear__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/ __webpack_require__.n(
        react_icons_lib_md_clear__WEBPACK_IMPORTED_MODULE_7__,
      )
      /* harmony reexport (default from non-harmony) */ __webpack_require__.d(
        __webpack_exports__,
        'Clear',
        function() {
          return react_icons_lib_md_clear__WEBPACK_IMPORTED_MODULE_7___default.a
        },
      )
      /* harmony import */ var react_icons_lib_md_close__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(
        /*! react-icons/lib/md/close */ 'react-icons/lib/md/close',
      )
      /* harmony import */ var react_icons_lib_md_close__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/ __webpack_require__.n(
        react_icons_lib_md_close__WEBPACK_IMPORTED_MODULE_8__,
      )
      /* harmony reexport (default from non-harmony) */ __webpack_require__.d(
        __webpack_exports__,
        'Close',
        function() {
          return react_icons_lib_md_close__WEBPACK_IMPORTED_MODULE_8___default.a
        },
      )
      /* harmony import */ var react_icons_lib_md_comment__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(
        /*! react-icons/lib/md/comment */ 'react-icons/lib/md/comment',
      )
      /* harmony import */ var react_icons_lib_md_comment__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/ __webpack_require__.n(
        react_icons_lib_md_comment__WEBPACK_IMPORTED_MODULE_9__,
      )
      /* harmony reexport (default from non-harmony) */ __webpack_require__.d(
        __webpack_exports__,
        'Comment',
        function() {
          return react_icons_lib_md_comment__WEBPACK_IMPORTED_MODULE_9___default.a
        },
      )
      /* harmony import */ var react_icons_lib_md_crop__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(
        /*! react-icons/lib/md/crop */ 'react-icons/lib/md/crop',
      )
      /* harmony import */ var react_icons_lib_md_crop__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/ __webpack_require__.n(
        react_icons_lib_md_crop__WEBPACK_IMPORTED_MODULE_10__,
      )
      /* harmony reexport (default from non-harmony) */ __webpack_require__.d(
        __webpack_exports__,
        'Crop',
        function() {
          return react_icons_lib_md_crop__WEBPACK_IMPORTED_MODULE_10___default.a
        },
      )
      /* harmony import */ var react_icons_lib_md_delete__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(
        /*! react-icons/lib/md/delete */ 'react-icons/lib/md/delete',
      )
      /* harmony import */ var react_icons_lib_md_delete__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/ __webpack_require__.n(
        react_icons_lib_md_delete__WEBPACK_IMPORTED_MODULE_11__,
      )
      /* harmony reexport (default from non-harmony) */ __webpack_require__.d(
        __webpack_exports__,
        'Delete',
        function() {
          return react_icons_lib_md_delete__WEBPACK_IMPORTED_MODULE_11___default.a
        },
      )
      /* harmony import */ var react_icons_lib_md_description__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(
        /*! react-icons/lib/md/description */ 'react-icons/lib/md/description',
      )
      /* harmony import */ var react_icons_lib_md_description__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/ __webpack_require__.n(
        react_icons_lib_md_description__WEBPACK_IMPORTED_MODULE_12__,
      )
      /* harmony reexport (default from non-harmony) */ __webpack_require__.d(
        __webpack_exports__,
        'Description',
        function() {
          return react_icons_lib_md_description__WEBPACK_IMPORTED_MODULE_12___default.a
        },
      )
      /* harmony import */ var react_icons_lib_md_done__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(
        /*! react-icons/lib/md/done */ 'react-icons/lib/md/done',
      )
      /* harmony import */ var react_icons_lib_md_done__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/ __webpack_require__.n(
        react_icons_lib_md_done__WEBPACK_IMPORTED_MODULE_13__,
      )
      /* harmony reexport (default from non-harmony) */ __webpack_require__.d(
        __webpack_exports__,
        'Done',
        function() {
          return react_icons_lib_md_done__WEBPACK_IMPORTED_MODULE_13___default.a
        },
      )
      /* harmony import */ var react_icons_lib_md_file_download__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(
        /*! react-icons/lib/md/file-download */ 'react-icons/lib/md/file-download',
      )
      /* harmony import */ var react_icons_lib_md_file_download__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/ __webpack_require__.n(
        react_icons_lib_md_file_download__WEBPACK_IMPORTED_MODULE_14__,
      )
      /* harmony reexport (default from non-harmony) */ __webpack_require__.d(
        __webpack_exports__,
        'Download',
        function() {
          return react_icons_lib_md_file_download__WEBPACK_IMPORTED_MODULE_14___default.a
        },
      )
      /* harmony import */ var react_icons_lib_md_edit__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(
        /*! react-icons/lib/md/edit */ 'react-icons/lib/md/edit',
      )
      /* harmony import */ var react_icons_lib_md_edit__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/ __webpack_require__.n(
        react_icons_lib_md_edit__WEBPACK_IMPORTED_MODULE_15__,
      )
      /* harmony reexport (default from non-harmony) */ __webpack_require__.d(
        __webpack_exports__,
        'Edit',
        function() {
          return react_icons_lib_md_edit__WEBPACK_IMPORTED_MODULE_15___default.a
        },
      )
      /* harmony import */ var react_icons_lib_md_email__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(
        /*! react-icons/lib/md/email */ 'react-icons/lib/md/email',
      )
      /* harmony import */ var react_icons_lib_md_email__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/ __webpack_require__.n(
        react_icons_lib_md_email__WEBPACK_IMPORTED_MODULE_16__,
      )
      /* harmony reexport (default from non-harmony) */ __webpack_require__.d(
        __webpack_exports__,
        'Email',
        function() {
          return react_icons_lib_md_email__WEBPACK_IMPORTED_MODULE_16___default.a
        },
      )
      /* harmony import */ var react_icons_lib_md_error__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(
        /*! react-icons/lib/md/error */ 'react-icons/lib/md/error',
      )
      /* harmony import */ var react_icons_lib_md_error__WEBPACK_IMPORTED_MODULE_17___default = /*#__PURE__*/ __webpack_require__.n(
        react_icons_lib_md_error__WEBPACK_IMPORTED_MODULE_17__,
      )
      /* harmony reexport (default from non-harmony) */ __webpack_require__.d(
        __webpack_exports__,
        'Error',
        function() {
          return react_icons_lib_md_error__WEBPACK_IMPORTED_MODULE_17___default.a
        },
      )
      /* harmony import */ var react_icons_lib_md_remove_red_eye__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(
        /*! react-icons/lib/md/remove-red-eye */ 'react-icons/lib/md/remove-red-eye',
      )
      /* harmony import */ var react_icons_lib_md_remove_red_eye__WEBPACK_IMPORTED_MODULE_18___default = /*#__PURE__*/ __webpack_require__.n(
        react_icons_lib_md_remove_red_eye__WEBPACK_IMPORTED_MODULE_18__,
      )
      /* harmony reexport (default from non-harmony) */ __webpack_require__.d(
        __webpack_exports__,
        'Eye',
        function() {
          return react_icons_lib_md_remove_red_eye__WEBPACK_IMPORTED_MODULE_18___default.a
        },
      )
      /* harmony import */ var react_icons_lib_fa_exclamation_triangle__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(
        /*! react-icons/lib/fa/exclamation-triangle */ 'react-icons/lib/fa/exclamation-triangle',
      )
      /* harmony import */ var react_icons_lib_fa_exclamation_triangle__WEBPACK_IMPORTED_MODULE_19___default = /*#__PURE__*/ __webpack_require__.n(
        react_icons_lib_fa_exclamation_triangle__WEBPACK_IMPORTED_MODULE_19__,
      )
      /* harmony reexport (default from non-harmony) */ __webpack_require__.d(
        __webpack_exports__,
        'Fallback',
        function() {
          return react_icons_lib_fa_exclamation_triangle__WEBPACK_IMPORTED_MODULE_19___default.a
        },
      )
      /* harmony import */ var react_icons_lib_md_file_upload__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(
        /*! react-icons/lib/md/file-upload */ 'react-icons/lib/md/file-upload',
      )
      /* harmony import */ var react_icons_lib_md_file_upload__WEBPACK_IMPORTED_MODULE_20___default = /*#__PURE__*/ __webpack_require__.n(
        react_icons_lib_md_file_upload__WEBPACK_IMPORTED_MODULE_20__,
      )
      /* harmony reexport (default from non-harmony) */ __webpack_require__.d(
        __webpack_exports__,
        'FileUpload',
        function() {
          return react_icons_lib_md_file_upload__WEBPACK_IMPORTED_MODULE_20___default.a
        },
      )
      /* harmony import */ var react_icons_lib_md_arrow_forward__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(
        /*! react-icons/lib/md/arrow-forward */ 'react-icons/lib/md/arrow-forward',
      )
      /* harmony import */ var react_icons_lib_md_arrow_forward__WEBPACK_IMPORTED_MODULE_21___default = /*#__PURE__*/ __webpack_require__.n(
        react_icons_lib_md_arrow_forward__WEBPACK_IMPORTED_MODULE_21__,
      )
      /* harmony reexport (default from non-harmony) */ __webpack_require__.d(
        __webpack_exports__,
        'Forward',
        function() {
          return react_icons_lib_md_arrow_forward__WEBPACK_IMPORTED_MODULE_21___default.a
        },
      )
      /* harmony import */ var react_icons_lib_md_view_module__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(
        /*! react-icons/lib/md/view-module */ 'react-icons/lib/md/view-module',
      )
      /* harmony import */ var react_icons_lib_md_view_module__WEBPACK_IMPORTED_MODULE_22___default = /*#__PURE__*/ __webpack_require__.n(
        react_icons_lib_md_view_module__WEBPACK_IMPORTED_MODULE_22__,
      )
      /* harmony reexport (default from non-harmony) */ __webpack_require__.d(
        __webpack_exports__,
        'GridView',
        function() {
          return react_icons_lib_md_view_module__WEBPACK_IMPORTED_MODULE_22___default.a
        },
      )
      /* harmony import */ var react_icons_lib_fa_header__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(
        /*! react-icons/lib/fa/header */ 'react-icons/lib/fa/header',
      )
      /* harmony import */ var react_icons_lib_fa_header__WEBPACK_IMPORTED_MODULE_23___default = /*#__PURE__*/ __webpack_require__.n(
        react_icons_lib_fa_header__WEBPACK_IMPORTED_MODULE_23__,
      )
      /* harmony reexport (default from non-harmony) */ __webpack_require__.d(
        __webpack_exports__,
        'Heading',
        function() {
          return react_icons_lib_fa_header__WEBPACK_IMPORTED_MODULE_23___default.a
        },
      )
      /* harmony import */ var react_icons_lib_md_info__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(
        /*! react-icons/lib/md/info */ 'react-icons/lib/md/info',
      )
      /* harmony import */ var react_icons_lib_md_info__WEBPACK_IMPORTED_MODULE_24___default = /*#__PURE__*/ __webpack_require__.n(
        react_icons_lib_md_info__WEBPACK_IMPORTED_MODULE_24__,
      )
      /* harmony reexport (default from non-harmony) */ __webpack_require__.d(
        __webpack_exports__,
        'Info',
        function() {
          return react_icons_lib_md_info__WEBPACK_IMPORTED_MODULE_24___default.a
        },
      )
      /* harmony import */ var react_icons_lib_md_laptop_chromebook__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(
        /*! react-icons/lib/md/laptop-chromebook */ 'react-icons/lib/md/laptop-chromebook',
      )
      /* harmony import */ var react_icons_lib_md_laptop_chromebook__WEBPACK_IMPORTED_MODULE_25___default = /*#__PURE__*/ __webpack_require__.n(
        react_icons_lib_md_laptop_chromebook__WEBPACK_IMPORTED_MODULE_25__,
      )
      /* harmony reexport (default from non-harmony) */ __webpack_require__.d(
        __webpack_exports__,
        'Laptop',
        function() {
          return react_icons_lib_md_laptop_chromebook__WEBPACK_IMPORTED_MODULE_25___default.a
        },
      )
      /* harmony import */ var react_icons_lib_md_view_list__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(
        /*! react-icons/lib/md/view-list */ 'react-icons/lib/md/view-list',
      )
      /* harmony import */ var react_icons_lib_md_view_list__WEBPACK_IMPORTED_MODULE_26___default = /*#__PURE__*/ __webpack_require__.n(
        react_icons_lib_md_view_list__WEBPACK_IMPORTED_MODULE_26__,
      )
      /* harmony reexport (default from non-harmony) */ __webpack_require__.d(
        __webpack_exports__,
        'ListView',
        function() {
          return react_icons_lib_md_view_list__WEBPACK_IMPORTED_MODULE_26___default.a
        },
      )
      /* harmony import */ var react_icons_lib_md_link__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(
        /*! react-icons/lib/md/link */ 'react-icons/lib/md/link',
      )
      /* harmony import */ var react_icons_lib_md_link__WEBPACK_IMPORTED_MODULE_27___default = /*#__PURE__*/ __webpack_require__.n(
        react_icons_lib_md_link__WEBPACK_IMPORTED_MODULE_27__,
      )
      /* harmony reexport (default from non-harmony) */ __webpack_require__.d(
        __webpack_exports__,
        'Link',
        function() {
          return react_icons_lib_md_link__WEBPACK_IMPORTED_MODULE_27___default.a
        },
      )
      /* harmony import */ var react_icons_lib_md_loop__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(
        /*! react-icons/lib/md/loop */ 'react-icons/lib/md/loop',
      )
      /* harmony import */ var react_icons_lib_md_loop__WEBPACK_IMPORTED_MODULE_28___default = /*#__PURE__*/ __webpack_require__.n(
        react_icons_lib_md_loop__WEBPACK_IMPORTED_MODULE_28__,
      )
      /* harmony reexport (default from non-harmony) */ __webpack_require__.d(
        __webpack_exports__,
        'Loop',
        function() {
          return react_icons_lib_md_loop__WEBPACK_IMPORTED_MODULE_28___default.a
        },
      )
      /* harmony import */ var react_icons_lib_fa_magic__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(
        /*! react-icons/lib/fa/magic */ 'react-icons/lib/fa/magic',
      )
      /* harmony import */ var react_icons_lib_fa_magic__WEBPACK_IMPORTED_MODULE_29___default = /*#__PURE__*/ __webpack_require__.n(
        react_icons_lib_fa_magic__WEBPACK_IMPORTED_MODULE_29__,
      )
      /* harmony reexport (default from non-harmony) */ __webpack_require__.d(
        __webpack_exports__,
        'Magic',
        function() {
          return react_icons_lib_fa_magic__WEBPACK_IMPORTED_MODULE_29___default.a
        },
      )
      /* harmony import */ var react_icons_lib_md_menu__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(
        /*! react-icons/lib/md/menu */ 'react-icons/lib/md/menu',
      )
      /* harmony import */ var react_icons_lib_md_menu__WEBPACK_IMPORTED_MODULE_30___default = /*#__PURE__*/ __webpack_require__.n(
        react_icons_lib_md_menu__WEBPACK_IMPORTED_MODULE_30__,
      )
      /* harmony reexport (default from non-harmony) */ __webpack_require__.d(
        __webpack_exports__,
        'Menu',
        function() {
          return react_icons_lib_md_menu__WEBPACK_IMPORTED_MODULE_30___default.a
        },
      )
      /* harmony import */ var react_icons_lib_md_import_contacts__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(
        /*! react-icons/lib/md/import-contacts */ 'react-icons/lib/md/import-contacts',
      )
      /* harmony import */ var react_icons_lib_md_import_contacts__WEBPACK_IMPORTED_MODULE_31___default = /*#__PURE__*/ __webpack_require__.n(
        react_icons_lib_md_import_contacts__WEBPACK_IMPORTED_MODULE_31__,
      )
      /* harmony reexport (default from non-harmony) */ __webpack_require__.d(
        __webpack_exports__,
        'Newspaper',
        function() {
          return react_icons_lib_md_import_contacts__WEBPACK_IMPORTED_MODULE_31___default.a
        },
      )
      /* harmony import */ var react_icons_lib_md_picture_as_pdf__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(
        /*! react-icons/lib/md/picture-as-pdf */ 'react-icons/lib/md/picture-as-pdf',
      )
      /* harmony import */ var react_icons_lib_md_picture_as_pdf__WEBPACK_IMPORTED_MODULE_32___default = /*#__PURE__*/ __webpack_require__.n(
        react_icons_lib_md_picture_as_pdf__WEBPACK_IMPORTED_MODULE_32__,
      )
      /* harmony reexport (default from non-harmony) */ __webpack_require__.d(
        __webpack_exports__,
        'Pdf',
        function() {
          return react_icons_lib_md_picture_as_pdf__WEBPACK_IMPORTED_MODULE_32___default.a
        },
      )
      /* harmony import */ var react_icons_lib_md_person__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(
        /*! react-icons/lib/md/person */ 'react-icons/lib/md/person',
      )
      /* harmony import */ var react_icons_lib_md_person__WEBPACK_IMPORTED_MODULE_33___default = /*#__PURE__*/ __webpack_require__.n(
        react_icons_lib_md_person__WEBPACK_IMPORTED_MODULE_33__,
      )
      /* harmony reexport (default from non-harmony) */ __webpack_require__.d(
        __webpack_exports__,
        'Person',
        function() {
          return react_icons_lib_md_person__WEBPACK_IMPORTED_MODULE_33___default.a
        },
      )
      /* harmony import */ var react_icons_lib_md_phone__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(
        /*! react-icons/lib/md/phone */ 'react-icons/lib/md/phone',
      )
      /* harmony import */ var react_icons_lib_md_phone__WEBPACK_IMPORTED_MODULE_34___default = /*#__PURE__*/ __webpack_require__.n(
        react_icons_lib_md_phone__WEBPACK_IMPORTED_MODULE_34__,
      )
      /* harmony reexport (default from non-harmony) */ __webpack_require__.d(
        __webpack_exports__,
        'Phone',
        function() {
          return react_icons_lib_md_phone__WEBPACK_IMPORTED_MODULE_34___default.a
        },
      )
      /* harmony import */ var react_icons_lib_fa_question_circle__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(
        /*! react-icons/lib/fa/question-circle */ 'react-icons/lib/fa/question-circle',
      )
      /* harmony import */ var react_icons_lib_fa_question_circle__WEBPACK_IMPORTED_MODULE_35___default = /*#__PURE__*/ __webpack_require__.n(
        react_icons_lib_fa_question_circle__WEBPACK_IMPORTED_MODULE_35__,
      )
      /* harmony reexport (default from non-harmony) */ __webpack_require__.d(
        __webpack_exports__,
        'Question',
        function() {
          return react_icons_lib_fa_question_circle__WEBPACK_IMPORTED_MODULE_35___default.a
        },
      )
      /* harmony import */ var react_icons_lib_md_format_quote__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(
        /*! react-icons/lib/md/format-quote */ 'react-icons/lib/md/format-quote',
      )
      /* harmony import */ var react_icons_lib_md_format_quote__WEBPACK_IMPORTED_MODULE_36___default = /*#__PURE__*/ __webpack_require__.n(
        react_icons_lib_md_format_quote__WEBPACK_IMPORTED_MODULE_36__,
      )
      /* harmony reexport (default from non-harmony) */ __webpack_require__.d(
        __webpack_exports__,
        'Quote',
        function() {
          return react_icons_lib_md_format_quote__WEBPACK_IMPORTED_MODULE_36___default.a
        },
      )
      /* harmony import */ var react_icons_lib_md_search__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(
        /*! react-icons/lib/md/search */ 'react-icons/lib/md/search',
      )
      /* harmony import */ var react_icons_lib_md_search__WEBPACK_IMPORTED_MODULE_37___default = /*#__PURE__*/ __webpack_require__.n(
        react_icons_lib_md_search__WEBPACK_IMPORTED_MODULE_37__,
      )
      /* harmony reexport (default from non-harmony) */ __webpack_require__.d(
        __webpack_exports__,
        'Search',
        function() {
          return react_icons_lib_md_search__WEBPACK_IMPORTED_MODULE_37___default.a
        },
      )
      /* harmony import */ var react_icons_lib_md_sync__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__(
        /*! react-icons/lib/md/sync */ 'react-icons/lib/md/sync',
      )
      /* harmony import */ var react_icons_lib_md_sync__WEBPACK_IMPORTED_MODULE_38___default = /*#__PURE__*/ __webpack_require__.n(
        react_icons_lib_md_sync__WEBPACK_IMPORTED_MODULE_38__,
      )
      /* harmony reexport (default from non-harmony) */ __webpack_require__.d(
        __webpack_exports__,
        'Sync',
        function() {
          return react_icons_lib_md_sync__WEBPACK_IMPORTED_MODULE_38___default.a
        },
      )
      /* harmony import */ var react_icons_lib_md_text_fields__WEBPACK_IMPORTED_MODULE_39__ = __webpack_require__(
        /*! react-icons/lib/md/text-fields */ 'react-icons/lib/md/text-fields',
      )
      /* harmony import */ var react_icons_lib_md_text_fields__WEBPACK_IMPORTED_MODULE_39___default = /*#__PURE__*/ __webpack_require__.n(
        react_icons_lib_md_text_fields__WEBPACK_IMPORTED_MODULE_39__,
      )
      /* harmony reexport (default from non-harmony) */ __webpack_require__.d(
        __webpack_exports__,
        'TextFields',
        function() {
          return react_icons_lib_md_text_fields__WEBPACK_IMPORTED_MODULE_39___default.a
        },
      )
      /* harmony import */ var react_icons_lib_md_access_time__WEBPACK_IMPORTED_MODULE_40__ = __webpack_require__(
        /*! react-icons/lib/md/access-time */ 'react-icons/lib/md/access-time',
      )
      /* harmony import */ var react_icons_lib_md_access_time__WEBPACK_IMPORTED_MODULE_40___default = /*#__PURE__*/ __webpack_require__.n(
        react_icons_lib_md_access_time__WEBPACK_IMPORTED_MODULE_40__,
      )
      /* harmony reexport (default from non-harmony) */ __webpack_require__.d(
        __webpack_exports__,
        'Time',
        function() {
          return react_icons_lib_md_access_time__WEBPACK_IMPORTED_MODULE_40___default.a
        },
      )
      /* harmony import */ var react_icons_lib_md_transform__WEBPACK_IMPORTED_MODULE_41__ = __webpack_require__(
        /*! react-icons/lib/md/transform */ 'react-icons/lib/md/transform',
      )
      /* harmony import */ var react_icons_lib_md_transform__WEBPACK_IMPORTED_MODULE_41___default = /*#__PURE__*/ __webpack_require__.n(
        react_icons_lib_md_transform__WEBPACK_IMPORTED_MODULE_41__,
      )
      /* harmony reexport (default from non-harmony) */ __webpack_require__.d(
        __webpack_exports__,
        'Transform',
        function() {
          return react_icons_lib_md_transform__WEBPACK_IMPORTED_MODULE_41___default.a
        },
      )
      /* harmony import */ var react_icons_lib_md_tune__WEBPACK_IMPORTED_MODULE_42__ = __webpack_require__(
        /*! react-icons/lib/md/tune */ 'react-icons/lib/md/tune',
      )
      /* harmony import */ var react_icons_lib_md_tune__WEBPACK_IMPORTED_MODULE_42___default = /*#__PURE__*/ __webpack_require__.n(
        react_icons_lib_md_tune__WEBPACK_IMPORTED_MODULE_42__,
      )
      /* harmony reexport (default from non-harmony) */ __webpack_require__.d(
        __webpack_exports__,
        'Tune',
        function() {
          return react_icons_lib_md_tune__WEBPACK_IMPORTED_MODULE_42___default.a
        },
      )
      // http://react-icons.github.io/react-icons/md.html

      setTimeout(function() {
        console.assert(
          typeof react_icons_lib_md_add_circle__WEBPACK_IMPORTED_MODULE_0___default.a !==
            'undefined',
          '[IMPORT]:',
          '_Add',
          'from',
          'react-icons/lib/md/add-circle',
          'is undefined.',
        )
      }, 0)

      setTimeout(function() {
        console.assert(
          typeof react_icons_lib_md_announcement__WEBPACK_IMPORTED_MODULE_1___default.a !==
            'undefined',
          '[IMPORT]:',
          '_Announce',
          'from',
          'react-icons/lib/md/announcement',
          'is undefined.',
        )
      }, 0)

      setTimeout(function() {
        console.assert(
          typeof react_icons_lib_md_art_track__WEBPACK_IMPORTED_MODULE_2___default.a !==
            'undefined',
          '[IMPORT]:',
          '_ArtTrack',
          'from',
          'react-icons/lib/md/art-track',
          'is undefined.',
        )
      }, 0)

      setTimeout(function() {
        console.assert(
          typeof react_icons_lib_md_subject__WEBPACK_IMPORTED_MODULE_3___default.a !==
            'undefined',
          '[IMPORT]:',
          '_Aside',
          'from',
          'react-icons/lib/md/subject',
          'is undefined.',
        )
      }, 0)

      setTimeout(function() {
        console.assert(
          typeof react_icons_lib_md_format_list_bulleted__WEBPACK_IMPORTED_MODULE_4___default.a !==
            'undefined',
          '[IMPORT]:',
          '_BulletList',
          'from',
          'react-icons/lib/md/format-list-bulleted',
          'is undefined.',
        )
      }, 0)

      setTimeout(function() {
        console.assert(
          typeof react_icons_lib_md_photo_camera__WEBPACK_IMPORTED_MODULE_5___default.a !==
            'undefined',
          '[IMPORT]:',
          '_Camera',
          'from',
          'react-icons/lib/md/photo-camera',
          'is undefined.',
        )
      }, 0)

      setTimeout(function() {
        console.assert(
          typeof react_icons_lib_md_camera_roll__WEBPACK_IMPORTED_MODULE_6___default.a !==
            'undefined',
          '[IMPORT]:',
          '_CameraRoll',
          'from',
          'react-icons/lib/md/camera-roll',
          'is undefined.',
        )
      }, 0)

      setTimeout(function() {
        console.assert(
          typeof react_icons_lib_md_clear__WEBPACK_IMPORTED_MODULE_7___default.a !==
            'undefined',
          '[IMPORT]:',
          '_Clear',
          'from',
          'react-icons/lib/md/clear',
          'is undefined.',
        )
      }, 0)

      setTimeout(function() {
        console.assert(
          typeof react_icons_lib_md_close__WEBPACK_IMPORTED_MODULE_8___default.a !==
            'undefined',
          '[IMPORT]:',
          '_Close',
          'from',
          'react-icons/lib/md/close',
          'is undefined.',
        )
      }, 0)

      setTimeout(function() {
        console.assert(
          typeof react_icons_lib_md_comment__WEBPACK_IMPORTED_MODULE_9___default.a !==
            'undefined',
          '[IMPORT]:',
          '_Comment',
          'from',
          'react-icons/lib/md/comment',
          'is undefined.',
        )
      }, 0)

      setTimeout(function() {
        console.assert(
          typeof react_icons_lib_md_crop__WEBPACK_IMPORTED_MODULE_10___default.a !==
            'undefined',
          '[IMPORT]:',
          '_Crop',
          'from',
          'react-icons/lib/md/crop',
          'is undefined.',
        )
      }, 0)

      setTimeout(function() {
        console.assert(
          typeof react_icons_lib_md_delete__WEBPACK_IMPORTED_MODULE_11___default.a !==
            'undefined',
          '[IMPORT]:',
          '_Delete',
          'from',
          'react-icons/lib/md/delete',
          'is undefined.',
        )
      }, 0)

      setTimeout(function() {
        console.assert(
          typeof react_icons_lib_md_description__WEBPACK_IMPORTED_MODULE_12___default.a !==
            'undefined',
          '[IMPORT]:',
          '_Description',
          'from',
          'react-icons/lib/md/description',
          'is undefined.',
        )
      }, 0)

      setTimeout(function() {
        console.assert(
          typeof react_icons_lib_md_done__WEBPACK_IMPORTED_MODULE_13___default.a !==
            'undefined',
          '[IMPORT]:',
          '_Done',
          'from',
          'react-icons/lib/md/done',
          'is undefined.',
        )
      }, 0)

      setTimeout(function() {
        console.assert(
          typeof react_icons_lib_md_file_download__WEBPACK_IMPORTED_MODULE_14___default.a !==
            'undefined',
          '[IMPORT]:',
          '_Download',
          'from',
          'react-icons/lib/md/file-download',
          'is undefined.',
        )
      }, 0)

      setTimeout(function() {
        console.assert(
          typeof react_icons_lib_md_edit__WEBPACK_IMPORTED_MODULE_15___default.a !==
            'undefined',
          '[IMPORT]:',
          '_Edit',
          'from',
          'react-icons/lib/md/edit',
          'is undefined.',
        )
      }, 0)

      setTimeout(function() {
        console.assert(
          typeof react_icons_lib_md_email__WEBPACK_IMPORTED_MODULE_16___default.a !==
            'undefined',
          '[IMPORT]:',
          '_Email',
          'from',
          'react-icons/lib/md/email',
          'is undefined.',
        )
      }, 0)

      setTimeout(function() {
        console.assert(
          typeof react_icons_lib_md_error__WEBPACK_IMPORTED_MODULE_17___default.a !==
            'undefined',
          '[IMPORT]:',
          '_Error',
          'from',
          'react-icons/lib/md/error',
          'is undefined.',
        )
      }, 0)

      setTimeout(function() {
        console.assert(
          typeof react_icons_lib_md_remove_red_eye__WEBPACK_IMPORTED_MODULE_18___default.a !==
            'undefined',
          '[IMPORT]:',
          '_Eye',
          'from',
          'react-icons/lib/md/remove-red-eye',
          'is undefined.',
        )
      }, 0)

      setTimeout(function() {
        console.assert(
          typeof react_icons_lib_fa_exclamation_triangle__WEBPACK_IMPORTED_MODULE_19___default.a !==
            'undefined',
          '[IMPORT]:',
          '_Fallback',
          'from',
          'react-icons/lib/fa/exclamation-triangle',
          'is undefined.',
        )
      }, 0)

      setTimeout(function() {
        console.assert(
          typeof react_icons_lib_md_file_upload__WEBPACK_IMPORTED_MODULE_20___default.a !==
            'undefined',
          '[IMPORT]:',
          '_FileUpload',
          'from',
          'react-icons/lib/md/file-upload',
          'is undefined.',
        )
      }, 0)

      setTimeout(function() {
        console.assert(
          typeof react_icons_lib_md_arrow_forward__WEBPACK_IMPORTED_MODULE_21___default.a !==
            'undefined',
          '[IMPORT]:',
          '_Forward',
          'from',
          'react-icons/lib/md/arrow-forward',
          'is undefined.',
        )
      }, 0)

      setTimeout(function() {
        console.assert(
          typeof react_icons_lib_md_view_module__WEBPACK_IMPORTED_MODULE_22___default.a !==
            'undefined',
          '[IMPORT]:',
          '_GridView',
          'from',
          'react-icons/lib/md/view-module',
          'is undefined.',
        )
      }, 0)

      setTimeout(function() {
        console.assert(
          typeof react_icons_lib_fa_header__WEBPACK_IMPORTED_MODULE_23___default.a !==
            'undefined',
          '[IMPORT]:',
          '_Heading',
          'from',
          'react-icons/lib/fa/header',
          'is undefined.',
        )
      }, 0)

      setTimeout(function() {
        console.assert(
          typeof react_icons_lib_md_info__WEBPACK_IMPORTED_MODULE_24___default.a !==
            'undefined',
          '[IMPORT]:',
          '_Info',
          'from',
          'react-icons/lib/md/info',
          'is undefined.',
        )
      }, 0)

      setTimeout(function() {
        console.assert(
          typeof react_icons_lib_md_laptop_chromebook__WEBPACK_IMPORTED_MODULE_25___default.a !==
            'undefined',
          '[IMPORT]:',
          '_Laptop',
          'from',
          'react-icons/lib/md/laptop-chromebook',
          'is undefined.',
        )
      }, 0)

      setTimeout(function() {
        console.assert(
          typeof react_icons_lib_md_view_list__WEBPACK_IMPORTED_MODULE_26___default.a !==
            'undefined',
          '[IMPORT]:',
          '_ListView',
          'from',
          'react-icons/lib/md/view-list',
          'is undefined.',
        )
      }, 0)

      setTimeout(function() {
        console.assert(
          typeof react_icons_lib_md_link__WEBPACK_IMPORTED_MODULE_27___default.a !==
            'undefined',
          '[IMPORT]:',
          '_Link',
          'from',
          'react-icons/lib/md/link',
          'is undefined.',
        )
      }, 0)

      setTimeout(function() {
        console.assert(
          typeof react_icons_lib_md_loop__WEBPACK_IMPORTED_MODULE_28___default.a !==
            'undefined',
          '[IMPORT]:',
          '_Loop',
          'from',
          'react-icons/lib/md/loop',
          'is undefined.',
        )
      }, 0)

      setTimeout(function() {
        console.assert(
          typeof react_icons_lib_fa_magic__WEBPACK_IMPORTED_MODULE_29___default.a !==
            'undefined',
          '[IMPORT]:',
          '_Magic',
          'from',
          'react-icons/lib/fa/magic',
          'is undefined.',
        )
      }, 0)

      setTimeout(function() {
        console.assert(
          typeof react_icons_lib_md_menu__WEBPACK_IMPORTED_MODULE_30___default.a !==
            'undefined',
          '[IMPORT]:',
          '_Menu',
          'from',
          'react-icons/lib/md/menu',
          'is undefined.',
        )
      }, 0)

      setTimeout(function() {
        console.assert(
          typeof react_icons_lib_md_import_contacts__WEBPACK_IMPORTED_MODULE_31___default.a !==
            'undefined',
          '[IMPORT]:',
          '_Newspaper',
          'from',
          'react-icons/lib/md/import-contacts',
          'is undefined.',
        )
      }, 0)

      setTimeout(function() {
        console.assert(
          typeof react_icons_lib_md_picture_as_pdf__WEBPACK_IMPORTED_MODULE_32___default.a !==
            'undefined',
          '[IMPORT]:',
          '_Pdf',
          'from',
          'react-icons/lib/md/picture-as-pdf',
          'is undefined.',
        )
      }, 0)

      setTimeout(function() {
        console.assert(
          typeof react_icons_lib_md_person__WEBPACK_IMPORTED_MODULE_33___default.a !==
            'undefined',
          '[IMPORT]:',
          '_Person',
          'from',
          'react-icons/lib/md/person',
          'is undefined.',
        )
      }, 0)

      setTimeout(function() {
        console.assert(
          typeof react_icons_lib_md_phone__WEBPACK_IMPORTED_MODULE_34___default.a !==
            'undefined',
          '[IMPORT]:',
          '_Phone',
          'from',
          'react-icons/lib/md/phone',
          'is undefined.',
        )
      }, 0)

      setTimeout(function() {
        console.assert(
          typeof react_icons_lib_fa_question_circle__WEBPACK_IMPORTED_MODULE_35___default.a !==
            'undefined',
          '[IMPORT]:',
          '_Question',
          'from',
          'react-icons/lib/fa/question-circle',
          'is undefined.',
        )
      }, 0)

      setTimeout(function() {
        console.assert(
          typeof react_icons_lib_md_format_quote__WEBPACK_IMPORTED_MODULE_36___default.a !==
            'undefined',
          '[IMPORT]:',
          '_Quote',
          'from',
          'react-icons/lib/md/format-quote',
          'is undefined.',
        )
      }, 0)

      setTimeout(function() {
        console.assert(
          typeof react_icons_lib_md_search__WEBPACK_IMPORTED_MODULE_37___default.a !==
            'undefined',
          '[IMPORT]:',
          '_Search',
          'from',
          'react-icons/lib/md/search',
          'is undefined.',
        )
      }, 0)

      setTimeout(function() {
        console.assert(
          typeof react_icons_lib_md_sync__WEBPACK_IMPORTED_MODULE_38___default.a !==
            'undefined',
          '[IMPORT]:',
          '_Sync',
          'from',
          'react-icons/lib/md/sync',
          'is undefined.',
        )
      }, 0)

      setTimeout(function() {
        console.assert(
          typeof react_icons_lib_md_text_fields__WEBPACK_IMPORTED_MODULE_39___default.a !==
            'undefined',
          '[IMPORT]:',
          '_TextFields',
          'from',
          'react-icons/lib/md/text-fields',
          'is undefined.',
        )
      }, 0)

      setTimeout(function() {
        console.assert(
          typeof react_icons_lib_md_access_time__WEBPACK_IMPORTED_MODULE_40___default.a !==
            'undefined',
          '[IMPORT]:',
          '_Time',
          'from',
          'react-icons/lib/md/access-time',
          'is undefined.',
        )
      }, 0)

      setTimeout(function() {
        console.assert(
          typeof react_icons_lib_md_transform__WEBPACK_IMPORTED_MODULE_41___default.a !==
            'undefined',
          '[IMPORT]:',
          '_Transform',
          'from',
          'react-icons/lib/md/transform',
          'is undefined.',
        )
      }, 0)

      setTimeout(function() {
        console.assert(
          typeof react_icons_lib_md_tune__WEBPACK_IMPORTED_MODULE_42___default.a !==
            'undefined',
          '[IMPORT]:',
          '_Tune',
          'from',
          'react-icons/lib/md/tune',
          'is undefined.',
        )
      }, 0)

      /***/
    },

    /***/ /*!******************************************!*\
  !*** ./src/react/components/LoadMore.js ***!
  \******************************************/
    /*! exports provided: LoadMore, ScrollSpy, default */
    /***/ './src/react/components/LoadMore.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module, React) {
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'LoadMore',
          function() {
            return LoadMore
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'ScrollSpy',
          function() {
            return ScrollSpy
          },
        )
        /* harmony import */ var utils_misc__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! utils/misc */ './src/react/utils/misc.js',
        )
        /* harmony import */ var components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! components/LoadingIndicator */ './src/react/components/LoadingIndicator/index.js',
        )
        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError('Cannot call a class as a function')
          }
        }

        function _possibleConstructorReturn(self, call) {
          if (!self) {
            throw new ReferenceError(
              "this hasn't been initialised - super() hasn't been called",
            )
          }
          return call &&
            (typeof call === 'object' || typeof call === 'function')
            ? call
            : self
        }

        function _inherits(subClass, superClass) {
          if (typeof superClass !== 'function' && superClass !== null) {
            throw new TypeError(
              'Super expression must either be null or a function, not ' +
                typeof superClass,
            )
          }
          subClass.prototype = Object.create(
            superClass && superClass.prototype,
            {
              constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true,
              },
            },
          )
          if (superClass)
            Object.setPrototypeOf
              ? Object.setPrototypeOf(subClass, superClass)
              : (subClass.__proto__ = superClass)
        }

        function _objectDestructuringEmpty(obj) {
          if (obj == null) throw new TypeError('Cannot destructure undefined')
        }

        setTimeout(function() {
          console.assert(
            typeof utils_misc__WEBPACK_IMPORTED_MODULE_0__['isVisible'] !==
              'undefined',
            '[IMPORT]:',
            'isVisible',
            'from',
            'utils/misc',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof utils_misc__WEBPACK_IMPORTED_MODULE_0__['debounce'] !==
              'undefined',
            '[IMPORT]:',
            'debounce',
            'from',
            'utils/misc',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_1__[
              'default'
            ] !== 'undefined',
            '[IMPORT]:',
            'LoadingIndicator',
            'from',
            'components/LoadingIndicator',
            'is undefined.',
          )
        }, 0)
        var FeedEnd = function FeedEnd(_ref) {
          _objectDestructuringEmpty(_ref)

          return React.createElement(
            'div',
            { className: 'FeedEnd' },
            'ingen flere saker',
          )
        }
        var SCROLLOFFSET = 500

        var LoadMore = function LoadMore(_ref2) {
          var fetchMore = _ref2.fetchMore,
            fetching = _ref2.fetching,
            _ref2$next = _ref2.next,
            next = _ref2$next === undefined ? true : _ref2$next

          var scrollHandler = function scrollHandler(el) {
            return (
              fetching ||
              (Object(utils_misc__WEBPACK_IMPORTED_MODULE_0__['isVisible'])(
                el,
                SCROLLOFFSET,
              ) &&
                fetchMore())
            )
          }
          var clickHandler = function clickHandler() {
            return fetching || fetchMore()
          }
          return next
            ? React.createElement(
                ScrollSpy,
                { onScroll: scrollHandler },
                React.createElement(
                  components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_1__[
                    'default'
                  ],
                  { onClick: clickHandler, fetching: fetching },
                ),
              )
            : React.createElement(FeedEnd, null)
        }

        var ScrollSpy = (function(_React$Component) {
          _inherits(ScrollSpy, _React$Component)

          function ScrollSpy(props) {
            _classCallCheck(this, ScrollSpy)

            var _this = _possibleConstructorReturn(
              this,
              _React$Component.call(this, props),
            )

            var onVisible = props.onVisible,
              onScroll = props.onScroll

            _this.scrollHandler = _this.scrollHandler.bind(_this)
            return _this
          }

          ScrollSpy.prototype.scrollHandler = function scrollHandler() {
            Object(utils_misc__WEBPACK_IMPORTED_MODULE_0__['debounce'])(
              this.props.onScroll,
            )(this.element)
          }

          ScrollSpy.prototype.componentDidMount = function componentDidMount() {
            window.addEventListener('scroll', this.scrollHandler, {
              capture: true,
              passive: true,
            })
            this.scrollHandler()
          }

          ScrollSpy.prototype.componentWillUnmount = function componentWillUnmount() {
            window.removeEventListener('scroll', this.scrollHandler)
          }

          ScrollSpy.prototype.componentDidUpdate = function componentDidUpdate() {
            this.scrollHandler()
          }

          ScrollSpy.prototype.render = function render() {
            var _this2 = this

            return React.createElement(
              'div',
              {
                className: 'ScrollSpy',
                style: { gridColumnEnd: 'span 6', gridRowEnd: 'span 3' },
                ref: function ref(el) {
                  return (_this2.element = el)
                },
              },
              this.props.children,
            )
          }

          // @ts-ignore
          ScrollSpy.prototype.__reactstandin__regenerateByEval = function __reactstandin__regenerateByEval(
            key,
            code,
          ) {
            // @ts-ignore
            this[key] = eval(code)
          }

          return ScrollSpy
        })(React.Component)

        var _default = LoadMore
        /* harmony default export */ __webpack_exports__['default'] = _default
        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            FeedEnd,
            'FeedEnd',
            '/app/src/react/components/LoadMore.js',
          )
          reactHotLoader.register(
            SCROLLOFFSET,
            'SCROLLOFFSET',
            '/app/src/react/components/LoadMore.js',
          )
          reactHotLoader.register(
            LoadMore,
            'LoadMore',
            '/app/src/react/components/LoadMore.js',
          )
          reactHotLoader.register(
            ScrollSpy,
            'ScrollSpy',
            '/app/src/react/components/LoadMore.js',
          )
          reactHotLoader.register(
            _default,
            'default',
            '/app/src/react/components/LoadMore.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
        __webpack_require__(/*! react */ 'react'),
      ))

      /***/
    },

    /***/ /*!*******************************************************************!*\
  !*** ./src/react/components/LoadingIndicator/LoadingIndicator.js ***!
  \*******************************************************************/
    /*! exports provided: JsonLoader, default */
    /***/ './src/react/components/LoadingIndicator/LoadingIndicator.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module, React, R) {
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'JsonLoader',
          function() {
            return JsonLoader
          },
        )
        /* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! classnames */ 'classnames',
        )
        /* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
          classnames__WEBPACK_IMPORTED_MODULE_0__,
        )
        /* harmony import */ var _LoadingIndicator_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! ./LoadingIndicator.scss */ './src/react/components/LoadingIndicator/LoadingIndicator.scss',
        )
        /* harmony import */ var _LoadingIndicator_scss__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(
          _LoadingIndicator_scss__WEBPACK_IMPORTED_MODULE_1__,
        )
        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        function _objectWithoutProperties(obj, keys) {
          var target = {}
          for (var i in obj) {
            if (keys.indexOf(i) >= 0) continue
            if (!Object.prototype.hasOwnProperty.call(obj, i)) continue
            target[i] = obj[i]
          }
          return target
        }

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError('Cannot call a class as a function')
          }
        }

        function _possibleConstructorReturn(self, call) {
          if (!self) {
            throw new ReferenceError(
              "this hasn't been initialised - super() hasn't been called",
            )
          }
          return call &&
            (typeof call === 'object' || typeof call === 'function')
            ? call
            : self
        }

        function _inherits(subClass, superClass) {
          if (typeof superClass !== 'function' && superClass !== null) {
            throw new TypeError(
              'Super expression must either be null or a function, not ' +
                typeof superClass,
            )
          }
          subClass.prototype = Object.create(
            superClass && superClass.prototype,
            {
              constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true,
              },
            },
          )
          if (superClass)
            Object.setPrototypeOf
              ? Object.setPrototypeOf(subClass, superClass)
              : (subClass.__proto__ = superClass)
        }

        setTimeout(function() {
          console.assert(
            typeof classnames__WEBPACK_IMPORTED_MODULE_0___default.a !==
              'undefined',
            '[IMPORT]:',
            'cx',
            'from',
            'classnames',
            'is undefined.',
          )
        }, 0)

        var Cube = (function(_React$Component) {
          _inherits(Cube, _React$Component)

          function Cube(props) {
            _classCallCheck(this, Cube)

            var _this = _possibleConstructorReturn(
              this,
              _React$Component.call(this, props),
            )

            _this.state = {
              isLoading: props.isLoading,
              isQuiet: !props.isLoading,
            }
            _this.handleAnimate = _this.handleAnimate.bind(_this)
            return _this
          }

          Cube.prototype.handleAnimate = function handleAnimate() {
            if (this.props.isLoading) return
            this.setState({ isLoading: false, isQuiet: true })
          }

          Cube.prototype.componentWillReceiveProps = function componentWillReceiveProps(
            _ref,
          ) {
            var isLoading = _ref.isLoading

            if (!isLoading) return
            this.setState({ isLoading: true, isQuiet: false })
          }

          Cube.prototype.render = function render() {
            return React.createElement('div', {
              className: classnames__WEBPACK_IMPORTED_MODULE_0___default()(
                'cube',
                'cube-' + this.props.n,
                this.state,
              ),
              onAnimationIteration: this.handleAnimate,
            })
          }

          // @ts-ignore
          Cube.prototype.__reactstandin__regenerateByEval = function __reactstandin__regenerateByEval(
            key,
            code,
          ) {
            // @ts-ignore
            this[key] = eval(code)
          }

          return Cube
        })(React.Component)

        var CubeGrid = function CubeGrid(_ref2) {
          var fetching = _ref2.fetching
          return React.createElement(
            'div',
            {
              className: classnames__WEBPACK_IMPORTED_MODULE_0___default()({
                fetching: fetching,
                cubeGrid: true,
              }),
            },
            R.map(function(n) {
              return React.createElement(Cube, {
                n: n,
                key: n,
                isLoading: fetching,
              })
            }, R.range(0, 9)),
          )
        }

        var JsonLoader = function JsonLoader(_ref3) {
          var children = _ref3.children,
            props = _objectWithoutProperties(_ref3, ['children'])

          return React.createElement(
            'div',
            { className: 'LoadingIndicator' },
            React.createElement(
              'pre',
              { style: { whiteSpace: 'pre-wrap' }, className: 'Loading' },
              JSON.stringify(props, null, 2),
            ),
            children,
          )
        }

        var LoadingIndicator = function LoadingIndicator(_ref4) {
          var debug = _ref4.debug,
            props = _objectWithoutProperties(_ref4, ['debug'])

          return debug
            ? React.createElement(JsonLoader, props)
            : React.createElement(
                'div',
                {
                  className: 'LoadingIndicator',
                  style: { cursor: props.onClick ? 'pointer' : 'unset' },
                  onClick: props.onClick,
                },
                React.createElement(CubeGrid, props),
                props.children,
              )
        }

        var _default = LoadingIndicator
        /* harmony default export */ __webpack_exports__['default'] = _default
        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            Cube,
            'Cube',
            '/app/src/react/components/LoadingIndicator/LoadingIndicator.js',
          )
          reactHotLoader.register(
            CubeGrid,
            'CubeGrid',
            '/app/src/react/components/LoadingIndicator/LoadingIndicator.js',
          )
          reactHotLoader.register(
            JsonLoader,
            'JsonLoader',
            '/app/src/react/components/LoadingIndicator/LoadingIndicator.js',
          )
          reactHotLoader.register(
            LoadingIndicator,
            'LoadingIndicator',
            '/app/src/react/components/LoadingIndicator/LoadingIndicator.js',
          )
          reactHotLoader.register(
            _default,
            'default',
            '/app/src/react/components/LoadingIndicator/LoadingIndicator.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
        __webpack_require__(/*! react */ 'react'),
        __webpack_require__(/*! ramda */ 'ramda'),
      ))

      /***/
    },

    /***/ /*!*********************************************************************!*\
  !*** ./src/react/components/LoadingIndicator/LoadingIndicator.scss ***!
  \*********************************************************************/
    /*! no static exports found */
    /***/ './src/react/components/LoadingIndicator/LoadingIndicator.scss': function(
      module,
      exports,
    ) {
      // empty (null-loader)
      /***/
    },

    /***/ /*!********************************************************!*\
  !*** ./src/react/components/LoadingIndicator/index.js ***!
  \********************************************************/
    /*! exports provided: default */
    /***/ './src/react/components/LoadingIndicator/index.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* harmony import */ var _LoadingIndicator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
        /*! ./LoadingIndicator.js */ './src/react/components/LoadingIndicator/LoadingIndicator.js',
      )
      /* harmony reexport (safe) */ __webpack_require__.d(
        __webpack_exports__,
        'default',
        function() {
          return _LoadingIndicator_js__WEBPACK_IMPORTED_MODULE_0__['default']
        },
      )

      setTimeout(function() {
        console.assert(
          typeof _LoadingIndicator_js__WEBPACK_IMPORTED_MODULE_0__[
            'default'
          ] !== 'undefined',
          '[IMPORT]:',
          '_default',
          'from',
          './LoadingIndicator.js',
          'is undefined.',
        )
      }, 0)

      /***/
    },

    /***/ /*!***************************************************!*\
  !*** ./src/react/components/Logos/Universitas.js ***!
  \***************************************************/
    /*! exports provided: default */
    /***/ './src/react/components/Logos/Universitas.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module) {
        /* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! react */ 'react',
        )
        /* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
          react__WEBPACK_IMPORTED_MODULE_0__,
        )
        var _extends =
          Object.assign ||
          function(target) {
            for (var i = 1; i < arguments.length; i++) {
              var source = arguments[i]
              for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                  target[key] = source[key]
                }
              }
            }
            return target
          }

        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        setTimeout(function() {
          console.assert(
            typeof react__WEBPACK_IMPORTED_MODULE_0___default.a !== 'undefined',
            '[IMPORT]:',
            'React',
            'from',
            'react',
            'is undefined.',
          )
        }, 0)
        var Universitas = function Universitas(props) {
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            'svg',
            _extends({ viewBox: '0 0 200 40' }, props),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement('path', {
              className: 'universitas',
              fill: '#C64A34',
              d:
                'M11.57 32.8H6.4V0H0v33.23C0 38.46.35 40 4.35 40h9.26c4 0 4.35-1.54 4.35-6.77V0h-6.4v32.8zm95.68-16.01h-6V7.15h6v9.63zm2.17 6.13c3.8 0 3.86-1.94 3.86-6.11V7.19c0-5.81-.43-7.2-3.86-7.2H94.94v40h6.31V24l7.44 16h6.88l-7.92-17.07h1.77zM200 13.33V7.18c0-5.11-.3-7.18-3.75-7.18h-10.74c-3.79 0-3.75 2.76-3.75 6.94v9.27c0 3.1 2.04 4.03 4.38 4.98l7.53 3.09v8.53h-5.51v-6.13h-6.4v6.13c0 4.82 0 7.18 3.64 7.18l10.91.01c3.76.02 3.69-3.01 3.69-7.19V22.5c0-3.27-2.65-4.05-5.02-5.02l-6.82-2.77V7.19h5.44v6.14h6.4zM130.64 0H120.1c-3.71 0-3.68 2.76-3.68 6.94v9.27c0 3.1 2 4.03 4.3 4.98l7.4 3.09-.01 8.53h-5.4v-6.14h-6.28v6.14c0 4.81 0 7.19 3.57 7.19h10.71c3.68 0 3.62-3.02 3.62-7.19V22.48c0-3.26-2.6-4.04-4.93-5.01l-6.7-2.77V7.19h5.35v6.14h6.28V7.18c0-5.11-.3-7.18-3.68-7.18m31.98 0H145.1v7.19h5.76v32.8h6.4V7.2h5.36V0zm-25.37 40h6.4V0h-6.4v40zm-55.4-18.01h6.55v-6.11h-6.55v-8.7H92.3V0H75.45v40h17.32v-7.2H81.85V22zm86.65 3.7l1.92-13.71 1.91 13.7h-3.83zm-2.24-25.7l-6.46 40h6.4l1.14-7.1h6.15l1.15 7.1h6.4l-6.47-40h-8.3zM63.14 28L58.92 0h-6.4l6.46 40h8.32l6.46-40h-6.4l-4.22 28zM34.2 20.75L28.7 0h-7.36v40h6.4V19.46L33.65 40h6.94V0h-6.4v20.75zM44.44 40h6.4V0h-6.4v40z',
            }),
          )
        }

        var _default = Universitas
        /* harmony default export */ __webpack_exports__['default'] = _default
        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            Universitas,
            'Universitas',
            '/app/src/react/components/Logos/Universitas.js',
          )
          reactHotLoader.register(
            _default,
            'default',
            '/app/src/react/components/Logos/Universitas.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
      ))

      /***/
    },

    /***/ /*!******************************************************!*\
  !*** ./src/react/components/Logos/Velferdstinget.js ***!
  \******************************************************/
    /*! exports provided: default */
    /***/ './src/react/components/Logos/Velferdstinget.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module) {
        /* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! react */ 'react',
        )
        /* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
          react__WEBPACK_IMPORTED_MODULE_0__,
        )
        var _extends =
          Object.assign ||
          function(target) {
            for (var i = 1; i < arguments.length; i++) {
              var source = arguments[i]
              for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                  target[key] = source[key]
                }
              }
            }
            return target
          }

        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        setTimeout(function() {
          console.assert(
            typeof react__WEBPACK_IMPORTED_MODULE_0___default.a !== 'undefined',
            '[IMPORT]:',
            'React',
            'from',
            'react',
            'is undefined.',
          )
        }, 0)
        var Velferdstinget = function Velferdstinget(props) {
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            'svg',
            _extends(
              { viewBox: '0 0 518 559', width: '1em', height: '1em' },
              props,
            ),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement('path', {
              d:
                'M262 465c-4.55 0-8.05 1.02-10.5 3.04-2.43 2.03-3.64 4.92-3.64 8.69 0 3 .86 5.39 2.6 7.16 1.76 1.77 4.53 3.06 8.3 3.87l3.78.84c2.3.5 3.82 1.08 4.58 1.72a3.35 3.35 0 0 1 1.17 2.74c0 1.31-.57 2.33-1.7 3.04-1.13.7-2.76 1.06-4.88 1.06-2.1 0-4.28-.32-6.54-.96a37.4 37.4 0 0 1-6.98-2.92v8.23a44 44 0 0 0 7.24 2.03c2.41.45 4.81.68 7.21.68 5.08 0 8.85-1.01 11.3-3.04 2.48-2.04 3.72-5.14 3.72-9.31 0-3.18-.89-5.62-2.66-7.35-1.77-1.72-4.76-3-8.96-3.84l-4.15-.84c-1.98-.4-3.35-.89-4.1-1.44a2.84 2.84 0 0 1-1.12-2.38 3.2 3.2 0 0 1 1.67-2.99c1.12-.64 2.84-.96 5.17-.96 1.75 0 3.62.23 5.6.7 1.97.48 4 1.18 6.07 2.1v-1.81h10.3v30.4h9.75v-30.4h12.2v30.4h9.75v-37.8h-44.3v.64a54.4 54.4 0 0 0-4.56-.84 44.3 44.3 0 0 0-6.4-.49zm124 0c-6.52 0-11.6 1.75-15.4 5.25-3.74 3.49-5.62 8.28-5.62 14.4 0 6.02 1.84 10.8 5.52 14.3s8.67 5.26 15 5.26c2.78 0 5.48-.3 8.1-.88 2.61-.6 5.14-1.48 7.57-2.66v-18.2h-15.2V489h5.96v7.34c-.7.27-1.48.48-2.36.61-.86.12-1.8.18-2.8.18-3.74 0-6.62-1.1-8.64-3.27-2.03-2.18-3.04-5.26-3.04-9.26 0-4.04 1.05-7.14 3.14-9.3 2.11-2.17 5.1-3.26 8.99-3.26 2.09 0 4.17.3 6.25.88 2.1.6 4.2 1.49 6.3 2.69v-7.83a30.5 30.5 0 0 0-6.53-2.1c-2.3-.47-4.7-.7-7.21-.7zm-363 .69l14 37.8h11.6l12.6-34v34h26.9v-7.37H71v-8.66h15.6v-7.37H71v-7.03h16.6v-7.37H52.9l-10 27.9-10-27.9zm67.2 0v37.8H116v-8H98.8v-30.4zm29.3 0v37.8h9.74v-16h15.6v-7.37h-15.6v-7.03h16.6v-7.37zm28.4 0v37.8h26.9v-7.37h-17.1v-8.66h15.6v-7.37h-15.6v-7.03h16.6v-7.37zm29 0v37.8h9.75v-14.3h2.76c1.59 0 2.85.34 3.8 1.03.96.7 1.9 1.98 2.83 3.88l4.6 9.39h8l-5.3-10.7a18.7 18.7 0 0 0-3.2-4.86 7.12 7.12 0 0 0-3.58-2.07c2.43-.76 4.25-1.95 5.45-3.55 1.21-1.6 1.82-3.65 1.82-6.15 0-3.61-1.17-6.25-3.5-7.93-2.3-1.67-5.95-2.5-10.9-2.5h-14.9zm34.2 0v37.8h10.3c5.67 0 9.93-.4 12.8-1.22a17.3 17.3 0 0 0 7.3-4.17 16.2 16.2 0 0 0 3.94-5.9c.86-2.25 1.3-4.8 1.3-7.65 0-2.82-.44-5.34-1.3-7.57a16.9 16.9 0 0 0-11.2-10c-2.8-.83-7.07-1.24-12.8-1.24zm114 0v37.8h9.25v-25.9l13.7 25.9h10.9v-37.8h-9.25v25.9l-13.8-25.9zm79.7 0v37.8h26.9v-7.37h-17.1v-8.66h15.6v-7.37h-15.6v-7.03h27.3v30.4h9.75v-30.4h12.5v-7.37h-59.4zm72.5 0v37.8h9.75v-37.8zm-291 7.06h4.1c2.04 0 3.5.37 4.38 1.11.9.75 1.34 1.98 1.34 3.7 0 1.74-.45 2.99-1.34 3.75-.88.76-2.34 1.14-4.38 1.14h-4.1zm34.2.3h3.5c4 0 7.04.98 9.13 2.94 2.1 1.96 3.14 4.81 3.14 8.56 0 3.76-1.05 6.63-3.16 8.6-2.1 1.98-5.13 2.97-9.12 2.97h-3.5v-23zm-202 46c-6.05 0-10.8 1.74-14.3 5.22-3.44 3.46-5.16 8.27-5.16 14.4 0 6.11 1.72 10.9 5.16 14.4 3.46 3.48 8.23 5.22 14.3 5.22s10.8-1.74 14.3-5.22c3.45-3.47 5.17-8.27 5.17-14.4 0-6.12-1.72-10.9-5.17-14.4-3.44-3.48-8.2-5.22-14.3-5.22zm37.1 0c-4.56 0-8.05 1.02-10.5 3.04-2.43 2.03-3.65 4.92-3.65 8.69 0 3 .87 5.39 2.61 7.16 1.76 1.77 4.53 3.06 8.3 3.87l3.78.84c2.3.5 3.82 1.08 4.58 1.72a3.35 3.35 0 0 1 1.17 2.74c0 1.31-.57 2.33-1.7 3.03-1.13.71-2.76 1.07-4.89 1.07-2.1 0-4.27-.32-6.53-.97a37.4 37.4 0 0 1-6.99-2.9v8.22c2.42.9 4.83 1.57 7.24 2.03 2.42.45 4.82.68 7.22.68 5.08 0 8.85-1.01 11.3-3.04 1.88-1.55 3.05-3.73 3.5-6.51v8.82h26.9v-7.37h-17.1v-30.4h-9.75v23.7a8.7 8.7 0 0 0-2.44-4.85c-1.77-1.72-4.76-3-8.96-3.85l-4.16-.83c-1.97-.4-3.34-.89-4.1-1.44a2.84 2.84 0 0 1-1.11-2.38c0-1.35.56-2.35 1.67-3 1.11-.63 2.84-.95 5.17-.95 1.75 0 3.62.23 5.6.7 1.97.48 4 1.18 6.07 2.1v-8a56.8 56.8 0 0 0-6.81-1.39c-2.2-.32-4.33-.48-6.4-.48zm62 0c-6.06 0-10.8 1.74-14.3 5.22-3.45 3.47-5.17 8.28-5.17 14.4 0 6.11 1.72 10.9 5.17 14.4 3.46 3.48 8.21 5.22 14.3 5.22 6.08 0 10.8-1.74 14.3-5.22 3.44-3.47 5.16-8.27 5.16-14.4 0-6.12-1.72-10.9-5.16-14.4-3.45-3.48-8.2-5.22-14.3-5.22zm54.8 0c-6.06 0-10.8 1.74-14.3 5.22-3.44 3.47-5.16 8.28-5.16 14.4 0 6.11 1.72 10.9 5.16 14.4 3.46 3.48 8.22 5.22 14.3 5.22s10.8-1.74 14.3-5.22c3.44-3.47 5.17-8.27 5.17-14.4 0-6.12-1.73-10.9-5.17-14.4-3.44-3.48-8.2-5.22-14.3-5.22zm42.8 0c-6.51 0-11.6 1.75-15.4 5.24-3.75 3.5-5.62 8.3-5.62 14.4 0 6.03 1.84 10.8 5.52 14.3 3.68 3.51 8.67 5.27 15 5.27 2.79 0 5.49-.3 8.1-.88 2.62-.6 5.14-1.48 7.57-2.66v-18h-15.2v6.53h5.95v7.34c-.69.27-1.47.47-2.35.61-.86.12-1.8.18-2.81.18-3.73 0-6.6-1.1-8.63-3.27-2.03-2.18-3.04-5.27-3.04-9.27 0-4.03 1.04-7.13 3.14-9.29 2.1-2.17 5.1-3.26 8.99-3.26 2.09 0 4.17.3 6.25.88 2.09.6 4.2 1.49 6.3 2.69v-7.83a30.5 30.5 0 0 0-6.53-2.1c-2.3-.47-4.7-.7-7.22-.7zm179 0c-4.56 0-8.05 1.02-10.5 3.04-2.43 2.03-3.65 4.92-3.65 8.69 0 3 .87 5.39 2.6 7.16 1.76 1.77 4.53 3.06 8.31 3.87l3.78.84c2.3.5 3.82 1.08 4.58 1.72a3.35 3.35 0 0 1 1.16 2.74c0 1.31-.56 2.33-1.7 3.03-1.12.71-2.75 1.07-4.88 1.07-2.1 0-4.27-.32-6.53-.97a37.4 37.4 0 0 1-6.99-2.9v8.22c2.41.9 4.83 1.57 7.24 2.03 2.42.45 4.82.68 7.22.68 5.08 0 8.85-1.01 11.3-3.04a10.2 10.2 0 0 0 3.5-6.42v8.73h9.75v-16h14.4v16h9.74v-37.8h-9.74v14.4h-16v-14.4h-9.75v23.6a8.67 8.67 0 0 0-2.43-4.79c-1.77-1.72-4.76-3-8.97-3.85l-4.15-.83c-1.97-.4-3.34-.89-4.1-1.44a2.84 2.84 0 0 1-1.11-2.38c0-1.35.55-2.35 1.67-3 1.11-.63 2.83-.95 5.16-.95 1.76 0 3.62.23 5.6.7 1.97.48 4 1.18 6.08 2.1v-8a56.8 56.8 0 0 0-6.82-1.39c-2.19-.32-4.33-.48-6.4-.48zm107 0c-4.55 0-8.05 1.02-10.5 3.04-2.43 2.03-3.64 4.92-3.64 8.69 0 3 .86 5.39 2.6 7.16 1.76 1.77 4.53 3.06 8.3 3.87l3.78.84c2.3.5 3.82 1.08 4.58 1.72a3.35 3.35 0 0 1 1.17 2.74c0 1.31-.57 2.33-1.7 3.03-1.13.71-2.76 1.07-4.88 1.07-2.1 0-4.28-.32-6.54-.97a37.4 37.4 0 0 1-6.99-2.9v8.22c2.42.9 4.83 1.57 7.25 2.03 2.41.45 4.81.68 7.21.68 5.08 0 8.85-1.01 11.3-3.04 2.48-2.04 3.72-5.14 3.72-9.31 0-3.18-.89-5.62-2.66-7.35-1.77-1.72-4.76-3-8.96-3.85l-4.15-.83c-1.98-.4-3.35-.89-4.1-1.44a2.84 2.84 0 0 1-1.12-2.38c0-1.35.56-2.35 1.67-3 1.12-.63 2.84-.95 5.17-.95 1.75 0 3.62.23 5.6.7 1.97.48 4 1.18 6.07 2.1v-8a56.8 56.8 0 0 0-6.81-1.39c-2.2-.32-4.33-.48-6.4-.48zm-244 .69l-14 37.8h9.8l2.4-6.89h15.2l2.38 6.89h9.8l-14-37.8h-11.6zm26.3 0v37.8h9.74v-15l15 14.9h36.5v-7.37h-17.1v-8.66h15.6v-7.37h-15.6V527h16.6v-7.36h-38l-14 13.8v-13.8h-9.74zm63.5 0v37.8h9.75v-14.3h2.76c1.58 0 2.85.34 3.8 1.03.96.7 1.9 1.98 2.83 3.87l4.6 9.4h10.4l-5.3-10.7a18.7 18.7 0 0 0-3.2-4.86 7.12 7.12 0 0 0-3.58-2.07c2.43-.76 4.25-1.95 5.44-3.55 1.22-1.6 1.83-3.65 1.83-6.15 0-3.61-1.17-6.26-3.5-7.93-2.31-1.67-5.96-2.5-10.9-2.5h-14.9zm102 0v22.7c0 5.35 1.34 9.33 4.03 12 2.68 2.61 6.76 3.92 12.2 3.92 5.5 0 9.6-1.3 12.3-3.92 2.68-2.62 4.03-6.6 4.03-12v-22.7h-9.75v22.7c0 3.12-.52 5.36-1.55 6.7-1 1.34-2.68 2-5 2s-4-.66-5.02-2-1.52-3.58-1.52-6.7v-22.7zm-132 .67v34.6l-17-18 18-17zm-299 5.7c2.98 0 5.3 1.1 6.93 3.3 1.64 2.2 2.46 5.28 2.46 9.26 0 3.97-.82 7.05-2.46 9.25s-3.95 3.29-6.93 3.29-5.28-1.1-6.92-3.3c-1.63-2.19-2.45-5.27-2.45-9.24 0-3.98.82-7.07 2.45-9.26 1.64-2.2 3.94-3.3 6.92-3.3zm99.1 0c3 0 5.3 1.1 6.94 3.3s2.46 5.28 2.46 9.26c0 3.97-.82 7.05-2.46 9.25s-3.95 3.29-6.94 3.29c-2.97 0-5.27-1.1-6.9-3.3-1.64-2.19-2.46-5.27-2.46-9.24 0-3.98.82-7.07 2.45-9.26 1.64-2.2 3.94-3.3 6.91-3.3zm54.8 0c2.99 0 5.3 1.1 6.94 3.3s2.45 5.28 2.45 9.26c0 3.97-.81 7.05-2.45 9.25s-3.95 3.29-6.94 3.29c-2.97 0-5.27-1.1-6.91-3.3-1.64-2.19-2.46-5.27-2.46-9.24 0-3.98.82-7.07 2.46-9.26 1.64-2.2 3.94-3.3 6.91-3.3zm184 .7h4.1c2.04 0 3.5.36 4.38 1.1.9.75 1.34 1.98 1.34 3.7 0 1.74-.45 2.99-1.34 3.75-.88.76-2.34 1.14-4.38 1.14h-4.1v-9.7zm-93.7 1.79l5.16 15h-10.4z',
              fill: '#231f20',
            }),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement('path', {
              d:
                'M166-.002c-20.1 0-37.6 10.1-47.7 27.5v-.004l-91.9 160c-10 17.4-10 37.6 0 55l.002.002 92.6 160c10 17.4 27.6 27.5 47.7 27.5h185c20.1 0 37.6-10.1 47.7-27.5v-.002l92.6-160c10-17.4 10-37.6 0-55v-.002l-94-160v.004c-10-16.9-27-27-47-27zm0 33.7h185c4.16 0 16.4 7.07 18.5 10.7v.002l92.6 160c2.08 3.61 2.08 17.7 0 21.3l-92.6 160v.002c-2.08 3.6-14.3 10.7-18.5 10.7H165c-4.16 0-16.4-7.07-18.5-10.7v-.002l-92.7-159c-2.08-3.61-2.08-17.7 0-21.3l92.7-161v-.002c2.08-3.61 14.3-10.7 18.5-10.7z',
              fill: '#54c5b0',
            }),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement('path', {
              fill: '#231f20',
              d:
                'M206 239l25.5-71h-51.2zm66.4-98.6l-66.4 174-66.7-174h133m107 25.5h-35v141h-27.6v-141h-35v-25.5h97.6v25.5',
            }),
          )
        }

        var _default = Velferdstinget
        /* harmony default export */ __webpack_exports__['default'] = _default
        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            Velferdstinget,
            'Velferdstinget',
            '/app/src/react/components/Logos/Velferdstinget.js',
          )
          reactHotLoader.register(
            _default,
            'default',
            '/app/src/react/components/Logos/Velferdstinget.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
      ))

      /***/
    },

    /***/ /*!*********************************************!*\
  !*** ./src/react/components/Logos/index.js ***!
  \*********************************************/
    /*! exports provided: Universitas, Velferdstinget */
    /***/ './src/react/components/Logos/index.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* harmony import */ var _Universitas__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
        /*! ./Universitas */ './src/react/components/Logos/Universitas.js',
      )
      /* harmony reexport (safe) */ __webpack_require__.d(
        __webpack_exports__,
        'Universitas',
        function() {
          return _Universitas__WEBPACK_IMPORTED_MODULE_0__['default']
        },
      )

      /* harmony import */ var _Velferdstinget__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
        /*! ./Velferdstinget */ './src/react/components/Logos/Velferdstinget.js',
      )
      /* harmony reexport (safe) */ __webpack_require__.d(
        __webpack_exports__,
        'Velferdstinget',
        function() {
          return _Velferdstinget__WEBPACK_IMPORTED_MODULE_1__['default']
        },
      )

      setTimeout(function() {
        console.assert(
          typeof _Universitas__WEBPACK_IMPORTED_MODULE_0__['default'] !==
            'undefined',
          '[IMPORT]:',
          '_Universitas',
          'from',
          './Universitas',
          'is undefined.',
        )
      }, 0)

      setTimeout(function() {
        console.assert(
          typeof _Velferdstinget__WEBPACK_IMPORTED_MODULE_1__['default'] !==
            'undefined',
          '[IMPORT]:',
          '_Velferdstinget',
          'from',
          './Velferdstinget',
          'is undefined.',
        )
      }, 0)

      /***/
    },

    /***/ /*!***************************************************!*\
  !*** ./src/react/components/NewsFeed/FeedItem.js ***!
  \***************************************************/
    /*! exports provided: default */
    /***/ './src/react/components/NewsFeed/FeedItem.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module, React) {
        /* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! classnames */ 'classnames',
        )
        /* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
          classnames__WEBPACK_IMPORTED_MODULE_0__,
        )
        /* harmony import */ var react_error_boundary__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! react-error-boundary */ 'react-error-boundary',
        )
        /* harmony import */ var react_error_boundary__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(
          react_error_boundary__WEBPACK_IMPORTED_MODULE_1__,
        )
        /* harmony import */ var redux_first_router_link__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          /*! redux-first-router-link */ 'redux-first-router-link',
        )
        /* harmony import */ var redux_first_router_link__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/ __webpack_require__.n(
          redux_first_router_link__WEBPACK_IMPORTED_MODULE_2__,
        )
        /* harmony import */ var ducks_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
          /*! ducks/router */ './src/react/ducks/router.js',
        )
        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        setTimeout(function() {
          console.assert(
            typeof classnames__WEBPACK_IMPORTED_MODULE_0___default.a !==
              'undefined',
            '[IMPORT]:',
            'cx',
            'from',
            'classnames',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof react_error_boundary__WEBPACK_IMPORTED_MODULE_1___default.a !==
              'undefined',
            '[IMPORT]:',
            'ErrorBoundary',
            'from',
            'react-error-boundary',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof redux_first_router_link__WEBPACK_IMPORTED_MODULE_2___default.a !==
              'undefined',
            '[IMPORT]:',
            'Link',
            'from',
            'redux-first-router-link',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof ducks_router__WEBPACK_IMPORTED_MODULE_3__['toStory'] !==
              'undefined',
            '[IMPORT]:',
            'toStory',
            'from',
            'ducks/router',
            'is undefined.',
          )
        }, 0)
        var position = function position(_ref) {
          var _ref$x = _ref.x,
            x = _ref$x === undefined ? 0.5 : _ref$x,
            _ref$y = _ref.y,
            y = _ref$y === undefined ? 0.5 : _ref$y
          return x * 100 + '% ' + y * 100 + '%'
        }

        var ifChildren = function ifChildren(Component) {
          return function(props) {
            return props.children ? React.createElement(Component, props) : null
          }
        }

        var Vignette = ifChildren(function(_ref2) {
          var children = _ref2.children,
            section = _ref2.section
          return React.createElement(
            'div',
            {
              className: classnames__WEBPACK_IMPORTED_MODULE_0___default()(
                'Vignette',
                'section-' + section,
              ),
            },
            children,
          )
        })
        var Headline = ifChildren(function(_ref3) {
          var children = _ref3.children
          return React.createElement('h1', { className: 'Headline' }, children)
        })
        var Kicker = ifChildren(function(_ref4) {
          var children = _ref4.children
          return React.createElement('h3', { className: 'Kicker' }, children)
        })
        var Lede = ifChildren(function(_ref5) {
          var children = _ref5.children
          return React.createElement('p', { className: 'Lede' }, children)
        })

        var FeedImage = function FeedImage(_ref6) {
          var image = _ref6.image,
            crop_box = _ref6.crop_box
          return image
            ? React.createElement('div', {
                className: 'FeedImage',
                style: {
                  backgroundRepeat: 'none',
                  backgroundImage: 'url(' + image + ')',
                  backgroundPosition: position(crop_box),
                  backgroundSize: 'cover',
                  height: '100%',
                },
              })
            : null
        }

        var FeedItem = function FeedItem(_ref7) {
          var headline = _ref7.headline,
            vignette = _ref7.vignette,
            kicker = _ref7.kicker,
            lede = _ref7.lede,
            columns = _ref7.columns,
            section = _ref7.section,
            rows = _ref7.rows,
            image = _ref7.image,
            crop_box = _ref7.crop_box,
            html_class = _ref7.html_class,
            language = _ref7.language,
            order = _ref7.order,
            story = _ref7.story

          var className = classnames__WEBPACK_IMPORTED_MODULE_0___default()(
            'FeedItem',
            'col-' + columns,
            'row-' + rows,
            html_class,
          )
          var title = order + ' ' + className
          return React.createElement(
            redux_first_router_link__WEBPACK_IMPORTED_MODULE_2___default.a,
            {
              to: Object(ducks_router__WEBPACK_IMPORTED_MODULE_3__['toStory'])(
                story,
              ),
              className: className,
            },
            React.createElement(
              react_error_boundary__WEBPACK_IMPORTED_MODULE_1___default.a,
              null,
              React.createElement(FeedImage, {
                image: image,
                crop_box: crop_box,
              }),
              React.createElement(Vignette, { section: section }, vignette),
              React.createElement(Kicker, null, kicker),
              React.createElement(Headline, null, headline),
              React.createElement(Lede, null, lede),
            ),
          )
        }

        var _default = FeedItem
        /* harmony default export */ __webpack_exports__['default'] = _default
        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            position,
            'position',
            '/app/src/react/components/NewsFeed/FeedItem.js',
          )
          reactHotLoader.register(
            ifChildren,
            'ifChildren',
            '/app/src/react/components/NewsFeed/FeedItem.js',
          )
          reactHotLoader.register(
            Vignette,
            'Vignette',
            '/app/src/react/components/NewsFeed/FeedItem.js',
          )
          reactHotLoader.register(
            Headline,
            'Headline',
            '/app/src/react/components/NewsFeed/FeedItem.js',
          )
          reactHotLoader.register(
            Kicker,
            'Kicker',
            '/app/src/react/components/NewsFeed/FeedItem.js',
          )
          reactHotLoader.register(
            Lede,
            'Lede',
            '/app/src/react/components/NewsFeed/FeedItem.js',
          )
          reactHotLoader.register(
            FeedImage,
            'FeedImage',
            '/app/src/react/components/NewsFeed/FeedItem.js',
          )
          reactHotLoader.register(
            FeedItem,
            'FeedItem',
            '/app/src/react/components/NewsFeed/FeedItem.js',
          )
          reactHotLoader.register(
            _default,
            'default',
            '/app/src/react/components/NewsFeed/FeedItem.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
        __webpack_require__(/*! react */ 'react'),
      ))

      /***/
    },

    /***/ /*!***************************************************!*\
  !*** ./src/react/components/NewsFeed/NewsFeed.js ***!
  \***************************************************/
    /*! exports provided: Feed, default */
    /***/ './src/react/components/NewsFeed/NewsFeed.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module, R, React) {
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'Feed',
          function() {
            return Feed
          },
        )
        /* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! react-redux */ 'react-redux',
        )
        /* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
          react_redux__WEBPACK_IMPORTED_MODULE_0__,
        )
        /* harmony import */ var ducks_newsFeed__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! ducks/newsFeed */ './src/react/ducks/newsFeed.js',
        )
        /* harmony import */ var components_LoadMore__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          /*! components/LoadMore */ './src/react/components/LoadMore.js',
        )
        /* harmony import */ var _FeedItem__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
          /*! ./FeedItem */ './src/react/components/NewsFeed/FeedItem.js',
        )
        var _extends =
          Object.assign ||
          function(target) {
            for (var i = 1; i < arguments.length; i++) {
              var source = arguments[i]
              for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                  target[key] = source[key]
                }
              }
            }
            return target
          }

        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        setTimeout(function() {
          console.assert(
            typeof react_redux__WEBPACK_IMPORTED_MODULE_0__['connect'] !==
              'undefined',
            '[IMPORT]:',
            'connect',
            'from',
            'react-redux',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof ducks_newsFeed__WEBPACK_IMPORTED_MODULE_1__[
              'feedRequested'
            ] !== 'undefined',
            '[IMPORT]:',
            'feedRequested',
            'from',
            'ducks/newsFeed',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof ducks_newsFeed__WEBPACK_IMPORTED_MODULE_1__['getFeed'] !==
              'undefined',
            '[IMPORT]:',
            'getFeed',
            'from',
            'ducks/newsFeed',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof ducks_newsFeed__WEBPACK_IMPORTED_MODULE_1__['getItems'] !==
              'undefined',
            '[IMPORT]:',
            'getItems',
            'from',
            'ducks/newsFeed',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof components_LoadMore__WEBPACK_IMPORTED_MODULE_2__[
              'default'
            ] !== 'undefined',
            '[IMPORT]:',
            'LoadMore',
            'from',
            'components/LoadMore',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof _FeedItem__WEBPACK_IMPORTED_MODULE_3__['default'] !==
              'undefined',
            '[IMPORT]:',
            'FeedItem',
            'from',
            './FeedItem',
            'is undefined.',
          )
        }, 0)
        var Feed = function Feed(_ref) {
          var _ref$items = _ref.items,
            items = _ref$items === undefined ? [] : _ref$items,
            fetching = _ref.fetching,
            next = _ref.next,
            feedRequested = _ref.feedRequested

          var offset = items.length ? R.last(items).order : null
          var fetchMore = function fetchMore() {
            return feedRequested({ offset: offset })
          }
          return React.createElement(
            'section',
            { className: 'NewsFeed' },
            items.map(function(props) {
              return React.createElement(
                _FeedItem__WEBPACK_IMPORTED_MODULE_3__['default'],
                _extends({ key: props.id }, props),
              )
            }),
            React.createElement(
              components_LoadMore__WEBPACK_IMPORTED_MODULE_2__['default'],
              { fetchMore: fetchMore, fetching: fetching, next: next },
            ),
          )
        }

        var _default = Object(
          react_redux__WEBPACK_IMPORTED_MODULE_0__['connect'],
        )(
          function(s) {
            return _extends(
              {
                items: Object(
                  ducks_newsFeed__WEBPACK_IMPORTED_MODULE_1__['getItems'],
                )(s),
              },
              Object(ducks_newsFeed__WEBPACK_IMPORTED_MODULE_1__['getFeed'])(s),
            )
          },
          {
            feedRequested:
              ducks_newsFeed__WEBPACK_IMPORTED_MODULE_1__['feedRequested'],
          },
        )(Feed)

        /* harmony default export */ __webpack_exports__['default'] = _default
        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            Feed,
            'Feed',
            '/app/src/react/components/NewsFeed/NewsFeed.js',
          )
          reactHotLoader.register(
            _default,
            'default',
            '/app/src/react/components/NewsFeed/NewsFeed.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
        __webpack_require__(/*! ramda */ 'ramda'),
        __webpack_require__(/*! react */ 'react'),
      ))

      /***/
    },

    /***/ /*!*****************************************************!*\
  !*** ./src/react/components/NewsFeed/NewsFeed.scss ***!
  \*****************************************************/
    /*! no static exports found */
    /***/ './src/react/components/NewsFeed/NewsFeed.scss': function(
      module,
      exports,
    ) {
      // empty (null-loader)
      /***/
    },

    /***/ /*!*****************************************************!*\
  !*** ./src/react/components/NewsFeed/SearchFeed.js ***!
  \*****************************************************/
    /*! exports provided: default */
    /***/ './src/react/components/NewsFeed/SearchFeed.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module) {
        /* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! react-redux */ 'react-redux',
        )
        /* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
          react_redux__WEBPACK_IMPORTED_MODULE_0__,
        )
        /* harmony import */ var ducks_newsFeed__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! ducks/newsFeed */ './src/react/ducks/newsFeed.js',
        )
        /* harmony import */ var _NewsFeed__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          /*! ./NewsFeed */ './src/react/components/NewsFeed/NewsFeed.js',
        )
        var _extends =
          Object.assign ||
          function(target) {
            for (var i = 1; i < arguments.length; i++) {
              var source = arguments[i]
              for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                  target[key] = source[key]
                }
              }
            }
            return target
          }

        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        setTimeout(function() {
          console.assert(
            typeof react_redux__WEBPACK_IMPORTED_MODULE_0__['connect'] !==
              'undefined',
            '[IMPORT]:',
            'connect',
            'from',
            'react-redux',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof ducks_newsFeed__WEBPACK_IMPORTED_MODULE_1__[
              'feedRequested'
            ] !== 'undefined',
            '[IMPORT]:',
            'feedRequested',
            'from',
            'ducks/newsFeed',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof ducks_newsFeed__WEBPACK_IMPORTED_MODULE_1__[
              'getSearchResults'
            ] !== 'undefined',
            '[IMPORT]:',
            'getSearchResults',
            'from',
            'ducks/newsFeed',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof ducks_newsFeed__WEBPACK_IMPORTED_MODULE_1__['getFeed'] !==
              'undefined',
            '[IMPORT]:',
            'getFeed',
            'from',
            'ducks/newsFeed',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof _NewsFeed__WEBPACK_IMPORTED_MODULE_2__['Feed'] !==
              'undefined',
            '[IMPORT]:',
            'Feed',
            'from',
            './NewsFeed',
            'is undefined.',
          )
        }, 0)
        var mapStateToProps = function mapStateToProps(s) {
          return _extends(
            {
              items: Object(
                ducks_newsFeed__WEBPACK_IMPORTED_MODULE_1__['getSearchResults'],
              )(s),
            },
            Object(ducks_newsFeed__WEBPACK_IMPORTED_MODULE_1__['getFeed'])(s),
          )
        }
        var mapDispatchToProps = function mapDispatchToProps(
          dispatch,
          ownProps,
        ) {
          return {
            feedRequested:
              ducks_newsFeed__WEBPACK_IMPORTED_MODULE_1__['feedRequested'],
          }
        }

        var _default = Object(
          react_redux__WEBPACK_IMPORTED_MODULE_0__['connect'],
        )(mapStateToProps, mapDispatchToProps)(
          _NewsFeed__WEBPACK_IMPORTED_MODULE_2__['Feed'],
        )

        /* harmony default export */ __webpack_exports__['default'] = _default
        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            mapStateToProps,
            'mapStateToProps',
            '/app/src/react/components/NewsFeed/SearchFeed.js',
          )
          reactHotLoader.register(
            mapDispatchToProps,
            'mapDispatchToProps',
            '/app/src/react/components/NewsFeed/SearchFeed.js',
          )
          reactHotLoader.register(
            _default,
            'default',
            '/app/src/react/components/NewsFeed/SearchFeed.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
      ))

      /***/
    },

    /***/ /*!************************************************!*\
  !*** ./src/react/components/NewsFeed/index.js ***!
  \************************************************/
    /*! exports provided: NewsFeed, SearchFeed */
    /***/ './src/react/components/NewsFeed/index.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* harmony import */ var _NewsFeed_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
        /*! ./NewsFeed.scss */ './src/react/components/NewsFeed/NewsFeed.scss',
      )
      /* harmony import */ var _NewsFeed_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
        _NewsFeed_scss__WEBPACK_IMPORTED_MODULE_0__,
      )
      /* harmony import */ var _NewsFeed_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
        /*! ./NewsFeed.js */ './src/react/components/NewsFeed/NewsFeed.js',
      )
      /* harmony reexport (safe) */ __webpack_require__.d(
        __webpack_exports__,
        'NewsFeed',
        function() {
          return _NewsFeed_js__WEBPACK_IMPORTED_MODULE_1__['default']
        },
      )

      /* harmony import */ var _SearchFeed_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
        /*! ./SearchFeed.js */ './src/react/components/NewsFeed/SearchFeed.js',
      )
      /* harmony reexport (safe) */ __webpack_require__.d(
        __webpack_exports__,
        'SearchFeed',
        function() {
          return _SearchFeed_js__WEBPACK_IMPORTED_MODULE_2__['default']
        },
      )

      setTimeout(function() {
        console.assert(
          typeof _NewsFeed_js__WEBPACK_IMPORTED_MODULE_1__['default'] !==
            'undefined',
          '[IMPORT]:',
          'NewsFeed',
          'from',
          './NewsFeed.js',
          'is undefined.',
        )
      }, 0)

      setTimeout(function() {
        console.assert(
          typeof _SearchFeed_js__WEBPACK_IMPORTED_MODULE_2__['default'] !==
            'undefined',
          '[IMPORT]:',
          'SearchFeed',
          'from',
          './SearchFeed.js',
          'is undefined.',
        )
      }, 0)

      /***/
    },

    /***/ /*!***********************************************************!*\
  !*** ./src/react/components/PageNotFound/PageNotFound.js ***!
  \***********************************************************/
    /*! exports provided: default */
    /***/ './src/react/components/PageNotFound/PageNotFound.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module, React) {
        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        var PageNotFound = function PageNotFound(_ref) {
          var HTTPstatus = _ref.HTTPstatus,
            _ref$children = _ref.children,
            children =
              _ref$children === undefined ? 'Fant ikke siden' : _ref$children
          return React.createElement(
            'main',
            { className: 'PageNotFound' },
            HTTPstatus && React.createElement('h1', null, 'HTTP ', HTTPstatus),
            children,
          )
        }

        var _default = PageNotFound
        /* harmony default export */ __webpack_exports__['default'] = _default
        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            PageNotFound,
            'PageNotFound',
            '/app/src/react/components/PageNotFound/PageNotFound.js',
          )
          reactHotLoader.register(
            _default,
            'default',
            '/app/src/react/components/PageNotFound/PageNotFound.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
        __webpack_require__(/*! react */ 'react'),
      ))

      /***/
    },

    /***/ /*!*************************************************************!*\
  !*** ./src/react/components/PageNotFound/PageNotFound.scss ***!
  \*************************************************************/
    /*! no static exports found */
    /***/ './src/react/components/PageNotFound/PageNotFound.scss': function(
      module,
      exports,
    ) {
      // empty (null-loader)
      /***/
    },

    /***/ /*!****************************************************!*\
  !*** ./src/react/components/PageNotFound/index.js ***!
  \****************************************************/
    /*! exports provided: default */
    /***/ './src/react/components/PageNotFound/index.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module) {
        /* harmony import */ var _PageNotFound_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! ./PageNotFound.js */ './src/react/components/PageNotFound/PageNotFound.js',
        )
        /* harmony import */ var _PageNotFound_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! ./PageNotFound.scss */ './src/react/components/PageNotFound/PageNotFound.scss',
        )
        /* harmony import */ var _PageNotFound_scss__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(
          _PageNotFound_scss__WEBPACK_IMPORTED_MODULE_1__,
        )
        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        setTimeout(function() {
          console.assert(
            typeof _PageNotFound_js__WEBPACK_IMPORTED_MODULE_0__['default'] !==
              'undefined',
            '[IMPORT]:',
            'PageNotFound',
            'from',
            './PageNotFound.js',
            'is undefined.',
          )
        }, 0)

        var _default = _PageNotFound_js__WEBPACK_IMPORTED_MODULE_0__['default']
        /* harmony default export */ __webpack_exports__['default'] = _default
        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            _default,
            'default',
            '/app/src/react/components/PageNotFound/index.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
      ))

      /***/
    },

    /***/ /*!********************************************!*\
  !*** ./src/react/components/PageSwitch.js ***!
  \********************************************/
    /*! exports provided: default */
    /***/ './src/react/components/PageSwitch.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module, R, React) {
        /* harmony import */ var react_error_boundary__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! react-error-boundary */ 'react-error-boundary',
        )
        /* harmony import */ var react_error_boundary__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
          react_error_boundary__WEBPACK_IMPORTED_MODULE_0__,
        )
        /* harmony import */ var react_helmet__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! react-helmet */ 'react-helmet',
        )
        /* harmony import */ var react_helmet__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(
          react_helmet__WEBPACK_IMPORTED_MODULE_1__,
        )
        /* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          /*! react-redux */ 'react-redux',
        )
        /* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/ __webpack_require__.n(
          react_redux__WEBPACK_IMPORTED_MODULE_2__,
        )
        /* harmony import */ var ducks_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
          /*! ducks/router */ './src/react/ducks/router.js',
        )
        /* harmony import */ var ducks_newsFeed__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
          /*! ducks/newsFeed */ './src/react/ducks/newsFeed.js',
        )
        /* harmony import */ var components_NewsFeed__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
          /*! components/NewsFeed */ './src/react/components/NewsFeed/index.js',
        )
        /* harmony import */ var components_Story__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
          /*! components/Story */ './src/react/components/Story/index.js',
        )
        /* harmony import */ var components_Pages_PDFArchive__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
          /*! components/Pages/PDFArchive */ './src/react/components/Pages/PDFArchive.js',
        )
        /* harmony import */ var components_Pages_PublicationSchedule__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(
          /*! components/Pages/PublicationSchedule */ './src/react/components/Pages/PublicationSchedule.js',
        )
        /* harmony import */ var components_Pages_AboutUniversitas__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(
          /*! components/Pages/AboutUniversitas */ './src/react/components/Pages/AboutUniversitas.js',
        )
        /* harmony import */ var components_Pages_AdvertiserInfo__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(
          /*! components/Pages/AdvertiserInfo */ './src/react/components/Pages/AdvertiserInfo.js',
        )
        /* harmony import */ var components_PageNotFound__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(
          /*! components/PageNotFound */ './src/react/components/PageNotFound/index.js',
        )
        var _pages

        var _extends =
          Object.assign ||
          function(target) {
            for (var i = 1; i < arguments.length; i++) {
              var source = arguments[i]
              for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                  target[key] = source[key]
                }
              }
            }
            return target
          }

        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        setTimeout(function() {
          console.assert(
            typeof react_error_boundary__WEBPACK_IMPORTED_MODULE_0__[
              'withErrorBoundary'
            ] !== 'undefined',
            '[IMPORT]:',
            'withErrorBoundary',
            'from',
            'react-error-boundary',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof react_helmet__WEBPACK_IMPORTED_MODULE_1__['Helmet'] !==
              'undefined',
            '[IMPORT]:',
            'Helmet',
            'from',
            'react-helmet',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof react_redux__WEBPACK_IMPORTED_MODULE_2__['connect'] !==
              'undefined',
            '[IMPORT]:',
            'connect',
            'from',
            'react-redux',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof ducks_router__WEBPACK_IMPORTED_MODULE_3__['getLocation'] !==
              'undefined',
            '[IMPORT]:',
            'getLocation',
            'from',
            'ducks/router',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof ducks_router__WEBPACK_IMPORTED_MODULE_3__['NOT_FOUND'] !==
              'undefined',
            '[IMPORT]:',
            'NOT_FOUND',
            'from',
            'ducks/router',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof ducks_router__WEBPACK_IMPORTED_MODULE_3__['AD_INFO'] !==
              'undefined',
            '[IMPORT]:',
            'AD_INFO',
            'from',
            'ducks/router',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof ducks_router__WEBPACK_IMPORTED_MODULE_3__['ABOUT'] !==
              'undefined',
            '[IMPORT]:',
            'ABOUT',
            'from',
            'ducks/router',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof ducks_router__WEBPACK_IMPORTED_MODULE_3__['SCHEDULE'] !==
              'undefined',
            '[IMPORT]:',
            'SCHEDULE',
            'from',
            'ducks/router',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof ducks_router__WEBPACK_IMPORTED_MODULE_3__['PDF'] !==
              'undefined',
            '[IMPORT]:',
            'PDF',
            'from',
            'ducks/router',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof ducks_router__WEBPACK_IMPORTED_MODULE_3__['SHORT_URL'] !==
              'undefined',
            '[IMPORT]:',
            'SHORT_URL',
            'from',
            'ducks/router',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof ducks_router__WEBPACK_IMPORTED_MODULE_3__['STORY'] !==
              'undefined',
            '[IMPORT]:',
            'STORY',
            'from',
            'ducks/router',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof ducks_router__WEBPACK_IMPORTED_MODULE_3__['SECTION'] !==
              'undefined',
            '[IMPORT]:',
            'SECTION',
            'from',
            'ducks/router',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof ducks_router__WEBPACK_IMPORTED_MODULE_3__['HOME'] !==
              'undefined',
            '[IMPORT]:',
            'HOME',
            'from',
            'ducks/router',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof ducks_newsFeed__WEBPACK_IMPORTED_MODULE_4__['getSearch'] !==
              'undefined',
            '[IMPORT]:',
            'getSearch',
            'from',
            'ducks/newsFeed',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof components_NewsFeed__WEBPACK_IMPORTED_MODULE_5__[
              'SearchFeed'
            ] !== 'undefined',
            '[IMPORT]:',
            'SearchFeed',
            'from',
            'components/NewsFeed',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof components_NewsFeed__WEBPACK_IMPORTED_MODULE_5__[
              'NewsFeed'
            ] !== 'undefined',
            '[IMPORT]:',
            'NewsFeed',
            'from',
            'components/NewsFeed',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof components_Story__WEBPACK_IMPORTED_MODULE_6__['default'] !==
              'undefined',
            '[IMPORT]:',
            'StoryPage',
            'from',
            'components/Story',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof components_Pages_PDFArchive__WEBPACK_IMPORTED_MODULE_7__[
              'default'
            ] !== 'undefined',
            '[IMPORT]:',
            'PDFArchive',
            'from',
            'components/Pages/PDFArchive',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof components_Pages_PublicationSchedule__WEBPACK_IMPORTED_MODULE_8__[
              'default'
            ] !== 'undefined',
            '[IMPORT]:',
            'PublicationSchedule',
            'from',
            'components/Pages/PublicationSchedule',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof components_Pages_AboutUniversitas__WEBPACK_IMPORTED_MODULE_9__[
              'default'
            ] !== 'undefined',
            '[IMPORT]:',
            'AboutUniversitas',
            'from',
            'components/Pages/AboutUniversitas',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof components_Pages_AdvertiserInfo__WEBPACK_IMPORTED_MODULE_10__[
              'default'
            ] !== 'undefined',
            '[IMPORT]:',
            'AdvertiserInfo',
            'from',
            'components/Pages/AdvertiserInfo',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof components_PageNotFound__WEBPACK_IMPORTED_MODULE_11__[
              'default'
            ] !== 'undefined',
            '[IMPORT]:',
            'PageNotFound',
            'from',
            'components/PageNotFound',
            'is undefined.',
          )
        }, 0)
        var captitalize = function captitalize(str) {
          return str.replace(/./, R.toUpper)
        }

        var PageHelmet = function PageHelmet(_ref) {
          var _ref$pageTitle = _ref.pageTitle,
            pageTitle = _ref$pageTitle === undefined ? '' : _ref$pageTitle,
            _ref$lede = _ref.lede,
            lede =
              _ref$lede === undefined
                ? 'Norges største studentavis'
                : _ref$lede,
            _ref$language = _ref.language,
            language = _ref$language === undefined ? 'nb' : _ref$language
          return pageTitle
            ? React.createElement(
                react_helmet__WEBPACK_IMPORTED_MODULE_1__['Helmet'],
                null,
                React.createElement(
                  'title',
                  null,
                  pageTitle + ' | universitas.no',
                ),
                React.createElement('link', {
                  rel: 'canonical',
                  href: R.path(['location', 'href'], global),
                }),
                React.createElement('meta', {
                  name: 'description',
                  content: lede,
                }),
                React.createElement('meta', {
                  property: 'og:type',
                  content: 'website',
                }),
                React.createElement('meta', {
                  property: 'og:title',
                  content: pageTitle,
                }),
                React.createElement('meta', {
                  property: 'og:description',
                  content: lede,
                }),
                React.createElement('meta', {
                  property: 'og:locale',
                  content: language,
                }),
              )
            : null
        }

        var pageWrapper = function pageWrapper(Page) {
          var toTitle =
            arguments.length > 1 && arguments[1] !== undefined
              ? arguments[1]
              : R.F

          var PageComponent = Object(
            react_error_boundary__WEBPACK_IMPORTED_MODULE_0__[
              'withErrorBoundary'
            ],
          )(Page)
          var pageTitle = R.pipe(
            toTitle,
            R.unless(R.is(String), R.always('')),
            R.trim,
            captitalize,
          )
          return R.pipe(
            R.converge(R.assoc('pageTitle'), [pageTitle, R.identity]),
            function(props) {
              return [
                React.createElement(
                  PageHelmet,
                  _extends({ key: 'head' }, props),
                ),
                React.createElement(
                  PageComponent,
                  _extends({ key: 'body' }, props),
                ),
              ]
            },
          )
        }

        var pages = ((_pages = {}),
        (_pages[
          ducks_router__WEBPACK_IMPORTED_MODULE_3__['HOME']
        ] = pageWrapper(
          components_NewsFeed__WEBPACK_IMPORTED_MODULE_5__['NewsFeed'],
          R.always('Forsiden'),
        )),
        (_pages[
          ducks_router__WEBPACK_IMPORTED_MODULE_3__['SECTION']
        ] = pageWrapper(
          components_NewsFeed__WEBPACK_IMPORTED_MODULE_5__['NewsFeed'],
          R.prop('section'),
        )),
        (_pages[
          ducks_router__WEBPACK_IMPORTED_MODULE_3__['STORY']
        ] = pageWrapper(
          components_Story__WEBPACK_IMPORTED_MODULE_6__['default'],
          R.prop('title'),
        )),
        (_pages[
          ducks_router__WEBPACK_IMPORTED_MODULE_3__['SHORT_URL']
        ] = pageWrapper(
          components_Story__WEBPACK_IMPORTED_MODULE_6__['default'],
          R.prop('id'),
        )),
        (_pages[
          ducks_router__WEBPACK_IMPORTED_MODULE_3__['PDF']
        ] = pageWrapper(
          components_Pages_PDFArchive__WEBPACK_IMPORTED_MODULE_7__['default'],
          function(_ref2) {
            var _ref2$year = _ref2.year,
              year = _ref2$year === undefined ? '' : _ref2$year
            return 'PDF-arkiv ' + year
          },
        )),
        (_pages[
          ducks_router__WEBPACK_IMPORTED_MODULE_3__['SCHEDULE']
        ] = pageWrapper(
          components_Pages_PublicationSchedule__WEBPACK_IMPORTED_MODULE_8__[
            'default'
          ],
          function(_ref3) {
            var _ref3$year = _ref3.year,
              year = _ref3$year === undefined ? '' : _ref3$year
            return 'Utgivelsesplan ' + year
          },
        )),
        (_pages[
          ducks_router__WEBPACK_IMPORTED_MODULE_3__['ABOUT']
        ] = pageWrapper(
          components_Pages_AboutUniversitas__WEBPACK_IMPORTED_MODULE_9__[
            'default'
          ],
          R.always('Om Universitas'),
        )),
        (_pages[
          ducks_router__WEBPACK_IMPORTED_MODULE_3__['AD_INFO']
        ] = pageWrapper(
          components_Pages_AdvertiserInfo__WEBPACK_IMPORTED_MODULE_10__[
            'default'
          ],
          R.always('Annonsér i Universitas'),
        )),
        (_pages[
          ducks_router__WEBPACK_IMPORTED_MODULE_3__['NOT_FOUND']
        ] = pageWrapper(
          components_PageNotFound__WEBPACK_IMPORTED_MODULE_11__['default'],
          R.always('ikke funnet (404)'),
        )),
        _pages)

        var PageSwitch = function PageSwitch(_ref4) {
          var _ref4$location = _ref4.location,
            location = _ref4$location === undefined ? {} : _ref4$location,
            _ref4$search = _ref4.search,
            search = _ref4$search === undefined ? '' : _ref4$search

          var PageComponent = search
            ? components_NewsFeed__WEBPACK_IMPORTED_MODULE_5__['SearchFeed']
            : pages[location.type] ||
              pages[ducks_router__WEBPACK_IMPORTED_MODULE_3__['NOT_FOUND']]
          return React.createElement(
            'main',
            { className: 'Page' },
            React.createElement(
              PageComponent,
              _extends({}, location.payload, { pathname: location.pathname }),
            ),
          )
        }

        var _default = Object(
          react_redux__WEBPACK_IMPORTED_MODULE_2__['connect'],
        )(
          R.applySpec({
            location: ducks_router__WEBPACK_IMPORTED_MODULE_3__['getLocation'],
            search: ducks_newsFeed__WEBPACK_IMPORTED_MODULE_4__['getSearch'],
          }),
        )(PageSwitch)

        /* harmony default export */ __webpack_exports__['default'] = _default
        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            captitalize,
            'captitalize',
            '/app/src/react/components/PageSwitch.js',
          )
          reactHotLoader.register(
            PageHelmet,
            'PageHelmet',
            '/app/src/react/components/PageSwitch.js',
          )
          reactHotLoader.register(
            pageWrapper,
            'pageWrapper',
            '/app/src/react/components/PageSwitch.js',
          )
          reactHotLoader.register(
            pages,
            'pages',
            '/app/src/react/components/PageSwitch.js',
          )
          reactHotLoader.register(
            PageSwitch,
            'PageSwitch',
            '/app/src/react/components/PageSwitch.js',
          )
          reactHotLoader.register(
            _default,
            'default',
            '/app/src/react/components/PageSwitch.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
        __webpack_require__(/*! ramda */ 'ramda'),
        __webpack_require__(/*! react */ 'react'),
      ))

      /***/
    },

    /***/ /*!********************************************************!*\
  !*** ./src/react/components/Pages/AboutUniversitas.js ***!
  \********************************************************/
    /*! exports provided: default */
    /***/ './src/react/components/Pages/AboutUniversitas.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module, React, R) {
        /* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! react-redux */ 'react-redux',
        )
        /* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
          react_redux__WEBPACK_IMPORTED_MODULE_0__,
        )
        /* harmony import */ var utils_text__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! utils/text */ './src/react/utils/text.js',
        )
        /* harmony import */ var redux_first_router_link__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          /*! redux-first-router-link */ 'redux-first-router-link',
        )
        /* harmony import */ var redux_first_router_link__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/ __webpack_require__.n(
          redux_first_router_link__WEBPACK_IMPORTED_MODULE_2__,
        )
        /* harmony import */ var ducks_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
          /*! ducks/router */ './src/react/ducks/router.js',
        )
        /* harmony import */ var components_Logos__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
          /*! components/Logos */ './src/react/components/Logos/index.js',
        )
        /* harmony import */ var components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
          /*! components/LoadingIndicator */ './src/react/components/LoadingIndicator/index.js',
        )
        /* harmony import */ var utils_hoc__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
          /*! utils/hoc */ './src/react/utils/hoc.js',
        )
        /* harmony import */ var ducks_site__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
          /*! ducks/site */ './src/react/ducks/site.js',
        )
        /* harmony import */ var components_Debug__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(
          /*! components/Debug */ './src/react/components/Debug.js',
        )
        /* harmony import */ var components_ContactCard__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(
          /*! components/ContactCard */ './src/react/components/ContactCard/index.js',
        )
        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        function _objectDestructuringEmpty(obj) {
          if (obj == null) throw new TypeError('Cannot destructure undefined')
        }

        setTimeout(function() {
          console.assert(
            typeof react_redux__WEBPACK_IMPORTED_MODULE_0__['connect'] !==
              'undefined',
            '[IMPORT]:',
            'connect',
            'from',
            'react-redux',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof utils_text__WEBPACK_IMPORTED_MODULE_1__['formatDate'] !==
              'undefined',
            '[IMPORT]:',
            'formatDate',
            'from',
            'utils/text',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof redux_first_router_link__WEBPACK_IMPORTED_MODULE_2___default.a !==
              'undefined',
            '[IMPORT]:',
            'Link',
            'from',
            'redux-first-router-link',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof ducks_router__WEBPACK_IMPORTED_MODULE_3__[
              'toPubSchedule'
            ] !== 'undefined',
            '[IMPORT]:',
            'toPubSchedule',
            'from',
            'ducks/router',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof ducks_router__WEBPACK_IMPORTED_MODULE_3__['toAdInfo'] !==
              'undefined',
            '[IMPORT]:',
            'toAdInfo',
            'from',
            'ducks/router',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof components_Logos__WEBPACK_IMPORTED_MODULE_4__[
              'Velferdstinget'
            ] !== 'undefined',
            '[IMPORT]:',
            'Velferdstinget',
            'from',
            'components/Logos',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_5__[
              'default'
            ] !== 'undefined',
            '[IMPORT]:',
            'LoadingIndicator',
            'from',
            'components/LoadingIndicator',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof utils_hoc__WEBPACK_IMPORTED_MODULE_6__['requestData'] !==
              'undefined',
            '[IMPORT]:',
            'requestData',
            'from',
            'utils/hoc',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof ducks_site__WEBPACK_IMPORTED_MODULE_7__['siteRequested'] !==
              'undefined',
            '[IMPORT]:',
            'siteRequested',
            'from',
            'ducks/site',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof ducks_site__WEBPACK_IMPORTED_MODULE_7__['getSite'] !==
              'undefined',
            '[IMPORT]:',
            'getSite',
            'from',
            'ducks/site',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof components_Debug__WEBPACK_IMPORTED_MODULE_8__['default'] !==
              'undefined',
            '[IMPORT]:',
            'Debug',
            'from',
            'components/Debug',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof components_ContactCard__WEBPACK_IMPORTED_MODULE_9__[
              'default'
            ] !== 'undefined',
            '[IMPORT]:',
            'ContactCard',
            'from',
            'components/ContactCard',
            'is undefined.',
          )
        }, 0)
        var style = {
          lineHeight: 0,
          margin: '0 0 0 1rem',
          fontSize: '10rem',
          float: 'right',
        }

        var SiO = function SiO(_ref) {
          _objectDestructuringEmpty(_ref)

          return React.createElement(
            'a',
            {
              className: 'Velferdstinget',
              style: style,
              href: 'http://www.studentvelferd.no/',
            },
            React.createElement(
              components_Logos__WEBPACK_IMPORTED_MODULE_4__['Velferdstinget'],
              null,
            ),
          )
        }

        var NextIssue = function NextIssue(_ref2) {
          var publication_date = _ref2.publication_date,
            issue_name = _ref2.issue_name
          return React.createElement(
            'p',
            { className: 'NextIssue' },
            'Neste avis er nr ',
            issue_name.replace(/\/.*/, ''),
            ' og kommer ut',
            ' ',
            Object(utils_text__WEBPACK_IMPORTED_MODULE_1__['formatDate'])(
              publication_date,
              'dddd D. MMMM',
            ),
            '.',
          )
        }

        var AboutUniversitas = function AboutUniversitas(_ref3) {
          var pageTitle = _ref3.pageTitle,
            issues = _ref3.issues,
            staff = _ref3.staff
          return React.createElement(
            'div',
            { className: 'AboutUniversitas' },
            React.createElement('h1', null, pageTitle),
            React.createElement(
              'p',
              null,
              'Universitas er Norges st\xF8rste studentavis.',
            ),
            React.createElement(
              'p',
              null,
              'Avisen har et opplag p\xE5 14 000, og kommer ut 35 ganger i \xE5ret.',
            ),
            React.createElement(SiO, null),
            React.createElement(
              'p',
              null,
              'Universitas mottar st\xF8tte fra Studentsamskipnaden i Oslo og Akershus (SiO), og alle studenter som betaler semesteravgift er dermed med p\xE5 \xE5 st\xF8tte Universitas \xF8konomisk. Papirutgaven av Universitas distribueres rundt p\xE5 l\xE6resteder tilknyttet SiO.',
            ),
            React.createElement(
              'p',
              null,
              'Velferdstinget i Oslo og Akershus fordeler semesteravgiften, men st\xE5r uten redaksjonelt ansvar.',
            ),
            React.createElement(
              'p',
              null,
              'Universitas legges ogs\xE5 ut ved studentbyene under SiO. Redaksjonen best\xE5r av fire heltidsansatte og en rekke journalister, fotografer, sideuttegnere etc. som jobber frilans.',
            ),
            React.createElement(
              'p',
              null,
              'V\xE5re redaksjonslokaler finner du i andre etasje i Eilert Sunds barnehage, Moltke Moes vei 33.',
            ),
            React.createElement(
              'p',
              null,
              'Vil du abonnere og f\xE5 Universitas hjem til deg eller til din arbeidsplass, ta kontakt med daglig leder Simen Eriksen p\xE5 tlf. 907 69 866, eller se under for andre m\xE5ter \xE5 komme i kontakt.',
            ),
            React.createElement('h3', null, 'Generell kontaktinfo'),
            React.createElement(
              'p',
              null,
              'Telefon: 907 69 866 Faks: 22 85 32 74 Postadresse: Boks 89 Blindern, 0314 Oslo Bes\xF8ksadresse: Moltke Moes vei 33',
            ),
            React.createElement(
              components_Debug__WEBPACK_IMPORTED_MODULE_8__['default'],
              issues,
            ),
            React.createElement('h3', null, 'Utgivelsesplan'),
            React.createElement(NextIssue, issues.next),
            React.createElement(
              'p',
              null,
              React.createElement(
                redux_first_router_link__WEBPACK_IMPORTED_MODULE_2___default.a,
                {
                  to: Object(
                    ducks_router__WEBPACK_IMPORTED_MODULE_3__['toPubSchedule'],
                  )(),
                },
                'Se hele planen.',
              ),
            ),
            React.createElement('h3', null, 'Annonsering'),
            React.createElement(
              'p',
              null,
              'Kontakt Geir Dorp p\xE5 mail',
              ' ',
              React.createElement(
                'a',
                { href: 'mailto:geirdo@universitas.no' },
                'geirdo@universitas.no',
              ),
              ' tlf: 916 64 496, eller ',
              React.createElement(
                redux_first_router_link__WEBPACK_IMPORTED_MODULE_2___default.a,
                {
                  to: Object(
                    ducks_router__WEBPACK_IMPORTED_MODULE_3__['toAdInfo'],
                  )(),
                },
                'les mer om annonsering.',
              ),
            ),
            React.createElement('h3', null, 'Redaksjonen'),
            R.map(
              components_ContactCard__WEBPACK_IMPORTED_MODULE_9__['default'],
              staff,
            ),
          )
        }

        var mapStateToProps = ducks_site__WEBPACK_IMPORTED_MODULE_7__['getSite']
        var mapDispatchToProps = {
          fetchData: ducks_site__WEBPACK_IMPORTED_MODULE_7__['siteRequested'],
        }

        var _default = Object(
          react_redux__WEBPACK_IMPORTED_MODULE_0__['connect'],
        )(mapStateToProps, mapDispatchToProps)(
          Object(utils_hoc__WEBPACK_IMPORTED_MODULE_6__['requestData'])(
            AboutUniversitas,
            'staff',
          ),
        )

        /* harmony default export */ __webpack_exports__['default'] = _default
        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            style,
            'style',
            '/app/src/react/components/Pages/AboutUniversitas.js',
          )
          reactHotLoader.register(
            SiO,
            'SiO',
            '/app/src/react/components/Pages/AboutUniversitas.js',
          )
          reactHotLoader.register(
            NextIssue,
            'NextIssue',
            '/app/src/react/components/Pages/AboutUniversitas.js',
          )
          reactHotLoader.register(
            AboutUniversitas,
            'AboutUniversitas',
            '/app/src/react/components/Pages/AboutUniversitas.js',
          )
          reactHotLoader.register(
            mapStateToProps,
            'mapStateToProps',
            '/app/src/react/components/Pages/AboutUniversitas.js',
          )
          reactHotLoader.register(
            mapDispatchToProps,
            'mapDispatchToProps',
            '/app/src/react/components/Pages/AboutUniversitas.js',
          )
          reactHotLoader.register(
            _default,
            'default',
            '/app/src/react/components/Pages/AboutUniversitas.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
        __webpack_require__(/*! react */ 'react'),
        __webpack_require__(/*! ramda */ 'ramda'),
      ))

      /***/
    },

    /***/ /*!******************************************************!*\
  !*** ./src/react/components/Pages/AdvertiserInfo.js ***!
  \******************************************************/
    /*! exports provided: default */
    /***/ './src/react/components/Pages/AdvertiserInfo.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module, R, React) {
        /* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! react-redux */ 'react-redux',
        )
        /* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
          react_redux__WEBPACK_IMPORTED_MODULE_0__,
        )
        /* harmony import */ var images_modulkart_liten_png__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! images/modulkart_liten.png */ './src/images/modulkart_liten.png',
        )
        /* harmony import */ var images_modulkart_liten_png__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(
          images_modulkart_liten_png__WEBPACK_IMPORTED_MODULE_1__,
        )
        /* harmony import */ var images_modulkart_png__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          /*! images/modulkart.png */ './src/images/modulkart.png',
        )
        /* harmony import */ var images_modulkart_png__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/ __webpack_require__.n(
          images_modulkart_png__WEBPACK_IMPORTED_MODULE_2__,
        )
        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        function _objectDestructuringEmpty(obj) {
          if (obj == null) throw new TypeError('Cannot destructure undefined')
        }

        setTimeout(function() {
          console.assert(
            typeof react_redux__WEBPACK_IMPORTED_MODULE_0__['connect'] !==
              'undefined',
            '[IMPORT]:',
            'connect',
            'from',
            'react-redux',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof images_modulkart_liten_png__WEBPACK_IMPORTED_MODULE_1___default.a !==
              'undefined',
            '[IMPORT]:',
            'modulKartLiten',
            'from',
            'images/modulkart_liten.png',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof images_modulkart_png__WEBPACK_IMPORTED_MODULE_2___default.a !==
              'undefined',
            '[IMPORT]:',
            'modulKart',
            'from',
            'images/modulkart.png',
            'is undefined.',
          )
        }, 0)
        var AD_MODULES = [
          { name: 'Modul 2 forside', width: 245, height: 55, price: 9100 },
          { name: 'Helside', width: 245, height: 355, price: 17560 },
          { name: 'Halvside stående', width: 145, height: 355, price: 10860 },
          { name: 'Halvside liggende', width: 245, height: 177, price: 9050 },
          { name: 'Modul 3', width: 145, height: 177, price: 5430 },
          { name: 'Modul 4', width: 95, height: 355, price: 7245 },
          { name: 'Modul 5', width: 245, height: 70, price: 3620 },
          { name: 'Modul 6', width: 145, height: 70, price: 2180 },
          { name: 'Modul 7', width: 95, height: 210, price: 4350 },
          { name: 'Modul 8', width: 45, height: 355, price: 3620 },
          { name: 'Modul 9', width: 95, height: 140, price: 2900 },
          { name: 'Modul 10', width: 95, height: 70, price: 1450 },
        ]

        var formatPrice = R.pipe(
          R.toString,
          R.reverse,
          R.splitEvery(3),
          R.join('\xA0'),
          R.reverse,
          R.concat(R.__, ',-'),
        )

        var Row = function Row(_ref) {
          var name = _ref.name,
            width = _ref.width,
            height = _ref.height,
            price = _ref.price
          return React.createElement(
            'tr',
            { key: name },
            React.createElement('td', null, name),
            React.createElement('td', null, width, ' mm'),
            React.createElement('td', null, height, ' mm'),
            React.createElement('td', null, formatPrice(price)),
          )
        }

        var ModulKart = function ModulKart(_ref2) {
          _objectDestructuringEmpty(_ref2)

          return React.createElement(
            'a',
            {
              href: images_modulkart_png__WEBPACK_IMPORTED_MODULE_2___default.a,
              className: 'ModulKart',
            },
            React.createElement('img', {
              style: { paddingLeft: '1rem' },
              title: 'Modulkart',
              alt: 'modulkart',
              src:
                images_modulkart_liten_png__WEBPACK_IMPORTED_MODULE_1___default.a,
            }),
          )
        }

        var AdvertiserInfo = function AdvertiserInfo(_ref3) {
          var pageTitle = _ref3.pageTitle,
            state = _ref3.state
          return React.createElement(
            'div',
            { className: 'AdvertiserInfo' },
            React.createElement('h1', null, pageTitle),
            React.createElement(
              'p',
              null,
              'Avisen har et opplag p\xE5 14 000 og distribueres til l\xE6resteder tilknyttet SiO, blant annet Universitetet i Oslo, Handelsh\xF8yskolen BI, H\xF8gskolen i Oslo og Akershus, Idrettsh\xF8gskolen, Musikkh\xF8gskolen, Politih\xF8gskolen, Kunsth\xF8gskolen og Menighetsfakultetet.',
            ),
            React.createElement(
              'div',
              { style: { display: 'flex' } },
              React.createElement(
                'div',
                { style: { flex: 1 } },
                React.createElement(
                  'table',
                  { className: 'univTable prices' },
                  React.createElement('caption', null, 'Annonsepriser'),
                  React.createElement(
                    'tbody',
                    null,
                    React.createElement(
                      'tr',
                      null,
                      React.createElement('th', null, 'Modul'),
                      React.createElement('th', null, 'Bredde'),
                      React.createElement('th', null, 'H\xF8yde'),
                      React.createElement('th', null, 'Pris'),
                    ),
                    R.map(Row, AD_MODULES),
                    React.createElement(
                      'tr',
                      null,
                      React.createElement(
                        'td',
                        { colSpan: '4' },
                        'Ta kontakt for andre formater',
                      ),
                    ),
                  ),
                ),
                React.createElement(
                  'table',
                  { className: 'univTable prices' },
                  React.createElement('caption', null, 'Tillegg'),
                  React.createElement(
                    'tbody',
                    null,
                    React.createElement(
                      'tr',
                      null,
                      React.createElement('td', null, 'Farge per annonse'),
                      React.createElement('td', null, '1575,-'),
                    ),
                    React.createElement(
                      'tr',
                      null,
                      React.createElement('td', null, 'Nyhetsside'),
                      React.createElement('td', null, '800,-'),
                    ),
                    React.createElement(
                      'tr',
                      null,
                      React.createElement('td', null, 'Kulturside'),
                      React.createElement('td', null, '600,-'),
                    ),
                  ),
                ),
                React.createElement(
                  'table',
                  { className: 'univTable prices' },
                  React.createElement(
                    'caption',
                    null,
                    'Annonsepriser p\xE5 nettsiden',
                  ),
                  React.createElement(
                    'tbody',
                    null,
                    React.createElement(
                      'tr',
                      null,
                      React.createElement('th', null, 'Plassering'),
                      React.createElement('th', null, 'bredde'),
                      React.createElement('th', null, 'h\xF8yde'),
                      React.createElement('th', null, 'pris/uke'),
                    ),
                    React.createElement(
                      'tr',
                      null,
                      React.createElement('td', null, 'Toppbanner'),
                      React.createElement('td', null, '960px'),
                      React.createElement('td', null, '150px'),
                      React.createElement('td', null, '19 900,-'),
                    ),
                    React.createElement(
                      'tr',
                      null,
                      React.createElement('td', null, 'Stolpe'),
                      React.createElement('td', null, '172px'),
                      React.createElement('td', null, '500px'),
                      React.createElement('td', null, '19 900,-'),
                    ),
                    React.createElement(
                      'tr',
                      null,
                      React.createElement(
                        'td',
                        { colSpan: '4' },
                        'Ta kontakt for andre formater',
                      ),
                    ),
                  ),
                ),
              ),
              React.createElement(ModulKart, null),
            ),
          )
        }
        var mapStateToProps = function mapStateToProps(state, ownProps) {
          return {}
        }
        var mapDispatchToProps = function mapDispatchToProps(
          dispatch,
          ownProps,
        ) {
          return {}
        }

        var _default = Object(
          react_redux__WEBPACK_IMPORTED_MODULE_0__['connect'],
        )(mapStateToProps, mapDispatchToProps)(AdvertiserInfo)

        /* harmony default export */ __webpack_exports__['default'] = _default
        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            AD_MODULES,
            'AD_MODULES',
            '/app/src/react/components/Pages/AdvertiserInfo.js',
          )
          reactHotLoader.register(
            formatPrice,
            'formatPrice',
            '/app/src/react/components/Pages/AdvertiserInfo.js',
          )
          reactHotLoader.register(
            Row,
            'Row',
            '/app/src/react/components/Pages/AdvertiserInfo.js',
          )
          reactHotLoader.register(
            ModulKart,
            'ModulKart',
            '/app/src/react/components/Pages/AdvertiserInfo.js',
          )
          reactHotLoader.register(
            AdvertiserInfo,
            'AdvertiserInfo',
            '/app/src/react/components/Pages/AdvertiserInfo.js',
          )
          reactHotLoader.register(
            mapStateToProps,
            'mapStateToProps',
            '/app/src/react/components/Pages/AdvertiserInfo.js',
          )
          reactHotLoader.register(
            mapDispatchToProps,
            'mapDispatchToProps',
            '/app/src/react/components/Pages/AdvertiserInfo.js',
          )
          reactHotLoader.register(
            _default,
            'default',
            '/app/src/react/components/Pages/AdvertiserInfo.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
        __webpack_require__(/*! ramda */ 'ramda'),
        __webpack_require__(/*! react */ 'react'),
      ))

      /***/
    },

    /***/ /*!**************************************************!*\
  !*** ./src/react/components/Pages/PDFArchive.js ***!
  \**************************************************/
    /*! exports provided: default */
    /***/ './src/react/components/Pages/PDFArchive.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module, React, R) {
        /* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! react-redux */ 'react-redux',
        )
        /* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
          react_redux__WEBPACK_IMPORTED_MODULE_0__,
        )
        /* harmony import */ var ducks_issues__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! ducks/issues */ './src/react/ducks/issues.js',
        )
        /* harmony import */ var ducks_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          /*! ducks/router */ './src/react/ducks/router.js',
        )
        /* harmony import */ var utils_hoc__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
          /*! utils/hoc */ './src/react/utils/hoc.js',
        )
        /* harmony import */ var components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
          /*! components/LoadingIndicator */ './src/react/components/LoadingIndicator/index.js',
        )
        /* harmony import */ var _PdfList__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
          /*! ./PdfList */ './src/react/components/Pages/PdfList/index.js',
        )
        /* harmony import */ var _YearNavigation__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
          /*! ./YearNavigation */ './src/react/components/Pages/YearNavigation/index.js',
        )
        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        setTimeout(function() {
          console.assert(
            typeof react_redux__WEBPACK_IMPORTED_MODULE_0__['connect'] !==
              'undefined',
            '[IMPORT]:',
            'connect',
            'from',
            'react-redux',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof ducks_issues__WEBPACK_IMPORTED_MODULE_1__[
              'issuesRequested'
            ] !== 'undefined',
            '[IMPORT]:',
            'issuesRequested',
            'from',
            'ducks/issues',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof ducks_issues__WEBPACK_IMPORTED_MODULE_1__['getIssues'] !==
              'undefined',
            '[IMPORT]:',
            'getIssues',
            'from',
            'ducks/issues',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof ducks_router__WEBPACK_IMPORTED_MODULE_2__['toPdf'] !==
              'undefined',
            '[IMPORT]:',
            'toPdf',
            'from',
            'ducks/router',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof utils_hoc__WEBPACK_IMPORTED_MODULE_3__['requestData'] !==
              'undefined',
            '[IMPORT]:',
            'requestData',
            'from',
            'utils/hoc',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_4__[
              'default'
            ] !== 'undefined',
            '[IMPORT]:',
            'LoadingIndicator',
            'from',
            'components/LoadingIndicator',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof _PdfList__WEBPACK_IMPORTED_MODULE_5__['default'] !==
              'undefined',
            '[IMPORT]:',
            'PdfList',
            'from',
            './PdfList',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof _YearNavigation__WEBPACK_IMPORTED_MODULE_6__['default'] !==
              'undefined',
            '[IMPORT]:',
            'YearNavigation',
            'from',
            './YearNavigation',
            'is undefined.',
          )
        }, 0)
        var currentYear = new Date().getFullYear()

        var PDFArchive = function PDFArchive(_ref) {
          var pageTitle = _ref.pageTitle,
            issues = _ref.issues,
            _ref$year = _ref.year,
            year = _ref$year === undefined ? currentYear : _ref$year
          return React.createElement(
            'div',
            { className: 'PDFArchive' },
            React.createElement(
              _YearNavigation__WEBPACK_IMPORTED_MODULE_6__['default'],
              {
                issues: issues,
                year: year,
                toUrl: ducks_router__WEBPACK_IMPORTED_MODULE_2__['toPdf'],
              },
            ),
            React.createElement('h1', null, pageTitle),
            React.createElement(
              _PdfList__WEBPACK_IMPORTED_MODULE_5__['default'],
              { issues: R.filter(R.propEq('year', year), issues) },
            ),
          )
        }

        var _default = Object(
          react_redux__WEBPACK_IMPORTED_MODULE_0__['connect'],
        )(ducks_issues__WEBPACK_IMPORTED_MODULE_1__['getIssues'], {
          fetchData:
            ducks_issues__WEBPACK_IMPORTED_MODULE_1__['issuesRequested'],
        })(
          Object(utils_hoc__WEBPACK_IMPORTED_MODULE_3__['requestData'])(
            PDFArchive,
            'issues',
            components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_4__['default'],
          ),
        )

        /* harmony default export */ __webpack_exports__['default'] = _default
        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            currentYear,
            'currentYear',
            '/app/src/react/components/Pages/PDFArchive.js',
          )
          reactHotLoader.register(
            PDFArchive,
            'PDFArchive',
            '/app/src/react/components/Pages/PDFArchive.js',
          )
          reactHotLoader.register(
            _default,
            'default',
            '/app/src/react/components/Pages/PDFArchive.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
        __webpack_require__(/*! react */ 'react'),
        __webpack_require__(/*! ramda */ 'ramda'),
      ))

      /***/
    },

    /***/ /*!*******************************************************!*\
  !*** ./src/react/components/Pages/PdfList/PdfList.js ***!
  \*******************************************************/
    /*! exports provided: default */
    /***/ './src/react/components/Pages/PdfList/PdfList.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module, React, R) {
        /* harmony import */ var utils_text__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! utils/text */ './src/react/utils/text.js',
        )
        /* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! classnames */ 'classnames',
        )
        /* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(
          classnames__WEBPACK_IMPORTED_MODULE_1__,
        )
        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        setTimeout(function() {
          console.assert(
            typeof utils_text__WEBPACK_IMPORTED_MODULE_0__['formatDate'] !==
              'undefined',
            '[IMPORT]:',
            'formatDate',
            'from',
            'utils/text',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof classnames__WEBPACK_IMPORTED_MODULE_1___default.a !==
              'undefined',
            '[IMPORT]:',
            'cx',
            'from',
            'classnames',
            'is undefined.',
          )
        }, 0)
        var Faximile = function Faximile(_ref) {
          var cover_page = _ref.cover_page,
            pages = _ref.pages,
            pdf = _ref.pdf
          return React.createElement(
            'div',
            { className: 'Faximile', key: cover_page },
            React.createElement(
              'a',
              { href: pdf },
              React.createElement('img', { src: cover_page }),
            ),
          )
        }

        var sortPdfs = R.propSatisfies(R.test(/_mag/), 'pdf')

        var Issue = function Issue(_ref2) {
          var publication_date = _ref2.publication_date,
            issue_name = _ref2.issue_name,
            pdfs = _ref2.pdfs
          return React.createElement(
            'div',
            {
              className: classnames__WEBPACK_IMPORTED_MODULE_1___default()(
                'Issue',
                { two: pdfs.length == 2 },
              ),
              key: publication_date,
            },
            React.createElement(
              'div',
              { className: 'text' },
              React.createElement('div', { className: 'name' }, issue_name),
              React.createElement(
                'div',
                { className: 'date' },
                Object(utils_text__WEBPACK_IMPORTED_MODULE_0__['formatDate'])(
                  publication_date,
                  'dddd D. MMMM',
                ),
              ),
            ),
            React.createElement(
              'div',
              { className: 'pdf' },
              R.pipe(R.sortBy(sortPdfs), R.map(Faximile))(pdfs),
            ),
          )
        }

        var PdfList = function PdfList(_ref3) {
          var _ref3$issues = _ref3.issues,
            issues = _ref3$issues === undefined ? [] : _ref3$issues
          return React.createElement(
            'section',
            { className: 'PdfList' },
            R.pipe(
              R.filter(R.propSatisfies(R.length, 'pdfs')),
              R.sortBy(R.prop('publication_date')),
              R.reverse,
              R.map(Issue),
            )(issues),
          )
        }

        var _default = PdfList
        /* harmony default export */ __webpack_exports__['default'] = _default
        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            Faximile,
            'Faximile',
            '/app/src/react/components/Pages/PdfList/PdfList.js',
          )
          reactHotLoader.register(
            sortPdfs,
            'sortPdfs',
            '/app/src/react/components/Pages/PdfList/PdfList.js',
          )
          reactHotLoader.register(
            Issue,
            'Issue',
            '/app/src/react/components/Pages/PdfList/PdfList.js',
          )
          reactHotLoader.register(
            PdfList,
            'PdfList',
            '/app/src/react/components/Pages/PdfList/PdfList.js',
          )
          reactHotLoader.register(
            _default,
            'default',
            '/app/src/react/components/Pages/PdfList/PdfList.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
        __webpack_require__(/*! react */ 'react'),
        __webpack_require__(/*! ramda */ 'ramda'),
      ))

      /***/
    },

    /***/ /*!*********************************************************!*\
  !*** ./src/react/components/Pages/PdfList/PdfList.scss ***!
  \*********************************************************/
    /*! no static exports found */
    /***/ './src/react/components/Pages/PdfList/PdfList.scss': function(
      module,
      exports,
    ) {
      // empty (null-loader)
      /***/
    },

    /***/ /*!*****************************************************!*\
  !*** ./src/react/components/Pages/PdfList/index.js ***!
  \*****************************************************/
    /*! exports provided: default */
    /***/ './src/react/components/Pages/PdfList/index.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module) {
        /* harmony import */ var _PdfList_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! ./PdfList.js */ './src/react/components/Pages/PdfList/PdfList.js',
        )
        /* harmony import */ var _PdfList_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! ./PdfList.scss */ './src/react/components/Pages/PdfList/PdfList.scss',
        )
        /* harmony import */ var _PdfList_scss__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(
          _PdfList_scss__WEBPACK_IMPORTED_MODULE_1__,
        )
        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        setTimeout(function() {
          console.assert(
            typeof _PdfList_js__WEBPACK_IMPORTED_MODULE_0__['default'] !==
              'undefined',
            '[IMPORT]:',
            'PdfList',
            'from',
            './PdfList.js',
            'is undefined.',
          )
        }, 0)

        var _default = _PdfList_js__WEBPACK_IMPORTED_MODULE_0__['default']
        /* harmony default export */ __webpack_exports__['default'] = _default
        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            _default,
            'default',
            '/app/src/react/components/Pages/PdfList/index.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
      ))

      /***/
    },

    /***/ /*!***********************************************************!*\
  !*** ./src/react/components/Pages/PublicationSchedule.js ***!
  \***********************************************************/
    /*! exports provided: default */
    /***/ './src/react/components/Pages/PublicationSchedule.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module, React) {
        /* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! react-redux */ 'react-redux',
        )
        /* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
          react_redux__WEBPACK_IMPORTED_MODULE_0__,
        )
        /* harmony import */ var react_helmet__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! react-helmet */ 'react-helmet',
        )
        /* harmony import */ var react_helmet__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(
          react_helmet__WEBPACK_IMPORTED_MODULE_1__,
        )
        /* harmony import */ var utils_hoc__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          /*! utils/hoc */ './src/react/utils/hoc.js',
        )
        /* harmony import */ var ducks_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
          /*! ducks/router */ './src/react/ducks/router.js',
        )
        /* harmony import */ var ducks_issues__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
          /*! ducks/issues */ './src/react/ducks/issues.js',
        )
        /* harmony import */ var _YearNavigation__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
          /*! ./YearNavigation */ './src/react/components/Pages/YearNavigation/index.js',
        )
        /* harmony import */ var _PublicationTable__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
          /*! ./PublicationTable */ './src/react/components/Pages/PublicationTable/index.js',
        )
        /* harmony import */ var components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
          /*! components/LoadingIndicator */ './src/react/components/LoadingIndicator/index.js',
        )
        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        setTimeout(function() {
          console.assert(
            typeof react_redux__WEBPACK_IMPORTED_MODULE_0__['connect'] !==
              'undefined',
            '[IMPORT]:',
            'connect',
            'from',
            'react-redux',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof react_helmet__WEBPACK_IMPORTED_MODULE_1__['Helmet'] !==
              'undefined',
            '[IMPORT]:',
            'Helmet',
            'from',
            'react-helmet',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof utils_hoc__WEBPACK_IMPORTED_MODULE_2__['requestData'] !==
              'undefined',
            '[IMPORT]:',
            'requestData',
            'from',
            'utils/hoc',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof ducks_router__WEBPACK_IMPORTED_MODULE_3__[
              'toPubSchedule'
            ] !== 'undefined',
            '[IMPORT]:',
            'toPubSchedule',
            'from',
            'ducks/router',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof ducks_issues__WEBPACK_IMPORTED_MODULE_4__[
              'issuesRequested'
            ] !== 'undefined',
            '[IMPORT]:',
            'issuesRequested',
            'from',
            'ducks/issues',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof ducks_issues__WEBPACK_IMPORTED_MODULE_4__['getIssues'] !==
              'undefined',
            '[IMPORT]:',
            'getIssues',
            'from',
            'ducks/issues',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof _YearNavigation__WEBPACK_IMPORTED_MODULE_5__['default'] !==
              'undefined',
            '[IMPORT]:',
            'YearNavigation',
            'from',
            './YearNavigation',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof _PublicationTable__WEBPACK_IMPORTED_MODULE_6__['default'] !==
              'undefined',
            '[IMPORT]:',
            'PublicationTable',
            'from',
            './PublicationTable',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_7__[
              'default'
            ] !== 'undefined',
            '[IMPORT]:',
            'LoadingIndicator',
            'from',
            'components/LoadingIndicator',
            'is undefined.',
          )
        }, 0)
        var currentYear = new Date().getFullYear()

        var PublicationSchedule = function PublicationSchedule(_ref) {
          var pageTitle = _ref.pageTitle,
            issues = _ref.issues,
            _ref$year = _ref.year,
            year = _ref$year === undefined ? currentYear : _ref$year
          return React.createElement(
            'div',
            { className: 'PublicationSchedule' },
            React.createElement(
              _YearNavigation__WEBPACK_IMPORTED_MODULE_5__['default'],
              {
                year: year,
                issues: issues,
                toUrl:
                  ducks_router__WEBPACK_IMPORTED_MODULE_3__['toPubSchedule'],
              },
            ),
            React.createElement('h1', null, pageTitle),
            React.createElement(
              'p',
              null,
              "Magasin er Universitas' m\xE5nedlige featurebilag",
            ),
            React.createElement(
              'p',
              null,
              "Velkomstbilaget Universitas' \xE5rlige velkomstmagasin for nye og gamle studenter. Det samme bilaget legges ved i avisenes to f\xF8rste utgaver",
            ),
            React.createElement(
              _PublicationTable__WEBPACK_IMPORTED_MODULE_6__['default'],
              { year: year, issues: issues },
            ),
          )
        }

        var _default = Object(
          react_redux__WEBPACK_IMPORTED_MODULE_0__['connect'],
        )(ducks_issues__WEBPACK_IMPORTED_MODULE_4__['getIssues'], {
          fetchData:
            ducks_issues__WEBPACK_IMPORTED_MODULE_4__['issuesRequested'],
        })(
          Object(utils_hoc__WEBPACK_IMPORTED_MODULE_2__['requestData'])(
            PublicationSchedule,
            'issues',
            components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_7__['default'],
          ),
        )

        /* harmony default export */ __webpack_exports__['default'] = _default
        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            currentYear,
            'currentYear',
            '/app/src/react/components/Pages/PublicationSchedule.js',
          )
          reactHotLoader.register(
            PublicationSchedule,
            'PublicationSchedule',
            '/app/src/react/components/Pages/PublicationSchedule.js',
          )
          reactHotLoader.register(
            _default,
            'default',
            '/app/src/react/components/Pages/PublicationSchedule.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
        __webpack_require__(/*! react */ 'react'),
      ))

      /***/
    },

    /***/ /*!*************************************************************************!*\
  !*** ./src/react/components/Pages/PublicationTable/PublicationTable.js ***!
  \*************************************************************************/
    /*! exports provided: default */
    /***/ './src/react/components/Pages/PublicationTable/PublicationTable.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module, React, R) {
        /* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! classnames */ 'classnames',
        )
        /* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
          classnames__WEBPACK_IMPORTED_MODULE_0__,
        )
        /* harmony import */ var utils_text__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! utils/text */ './src/react/utils/text.js',
        )
        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        setTimeout(function() {
          console.assert(
            typeof classnames__WEBPACK_IMPORTED_MODULE_0___default.a !==
              'undefined',
            '[IMPORT]:',
            'cx',
            'from',
            'classnames',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof utils_text__WEBPACK_IMPORTED_MODULE_1__['formatDate'] !==
              'undefined',
            '[IMPORT]:',
            'formatDate',
            'from',
            'utils/text',
            'is undefined.',
          )
        }, 0)
        var PublicationTable = function PublicationTable(_ref) {
          var year = _ref.year,
            _ref$issues = _ref.issues,
            issues = _ref$issues === undefined ? [] : _ref$issues
          return React.createElement(
            'table',
            {
              className: classnames__WEBPACK_IMPORTED_MODULE_0___default()(
                'PublicationTable',
                'univTable',
              ),
            },
            React.createElement(
              'thead',
              null,
              React.createElement(
                'tr',
                { className: 'IssueRow', key: 'issue_name' },
                React.createElement('th', null, 'Nr'),
                React.createElement('th', null, 'Bilag'),
                React.createElement('th', null, 'Utgivelsesdato'),
                React.createElement('th', null, 'Reklamefrist'),
              ),
            ),
            React.createElement(
              'tbody',
              null,
              R.pipe(
                R.filter(R.propEq('year', year)),
                dataTransform,
                R.map(IssueRow),
              )(issues),
            ),
          )
        }

        var IssueRow = function IssueRow(_ref2) {
          var adDeadLine = _ref2.adDeadLine,
            publication_date = _ref2.publication_date,
            number = _ref2.number,
            pdfs = _ref2.pdfs,
            issueType = _ref2.issueType,
            issue_name = _ref2.issue_name,
            future = _ref2.future
          return React.createElement(
            'tr',
            {
              className: classnames__WEBPACK_IMPORTED_MODULE_0___default()(
                'IssueRow',
                future ? 'future' : 'past',
              ),
              key: issue_name,
            },
            React.createElement('td', null, number),
            React.createElement('td', null, issueType),
            React.createElement(
              'td',
              null,
              Object(utils_text__WEBPACK_IMPORTED_MODULE_1__['formatDate'])(
                publication_date,
                'D. MMMM YYYY',
              ),
            ),
            React.createElement(
              'td',
              null,
              Object(utils_text__WEBPACK_IMPORTED_MODULE_1__['formatDate'])(
                adDeadLine,
                'D. MMMM YYYY',
              ),
            ),
          )
        }

        var DAY = 1000 * 60 * 60 * 24 // milliseconds in a day
        var ISSUE_TYPES = ['?', 'vanlig', 'magasin', 'velkomstbilag']

        var dataTransform = R.pipe(
          R.sortBy(R.prop('publication_date')),
          R.map(
            R.converge(R.merge, [
              R.identity,
              function(_ref3) {
                var publication_date = _ref3.publication_date,
                  issue_name = _ref3.issue_name,
                  issue_type = _ref3.issue_type
                return {
                  adDeadLine: new Date(new Date(publication_date) - 2 * DAY),
                  number: issue_name.split('/')[0],
                  issueType: ISSUE_TYPES[issue_type],
                  future: new Date(publication_date) > new Date(),
                }
              },
            ]),
          ),
        )

        var _default = PublicationTable
        /* harmony default export */ __webpack_exports__['default'] = _default
        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            PublicationTable,
            'PublicationTable',
            '/app/src/react/components/Pages/PublicationTable/PublicationTable.js',
          )
          reactHotLoader.register(
            IssueRow,
            'IssueRow',
            '/app/src/react/components/Pages/PublicationTable/PublicationTable.js',
          )
          reactHotLoader.register(
            DAY,
            'DAY',
            '/app/src/react/components/Pages/PublicationTable/PublicationTable.js',
          )
          reactHotLoader.register(
            ISSUE_TYPES,
            'ISSUE_TYPES',
            '/app/src/react/components/Pages/PublicationTable/PublicationTable.js',
          )
          reactHotLoader.register(
            dataTransform,
            'dataTransform',
            '/app/src/react/components/Pages/PublicationTable/PublicationTable.js',
          )
          reactHotLoader.register(
            _default,
            'default',
            '/app/src/react/components/Pages/PublicationTable/PublicationTable.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
        __webpack_require__(/*! react */ 'react'),
        __webpack_require__(/*! ramda */ 'ramda'),
      ))

      /***/
    },

    /***/ /*!***************************************************************************!*\
  !*** ./src/react/components/Pages/PublicationTable/PublicationTable.scss ***!
  \***************************************************************************/
    /*! no static exports found */
    /***/ './src/react/components/Pages/PublicationTable/PublicationTable.scss': function(
      module,
      exports,
    ) {
      // empty (null-loader)
      /***/
    },

    /***/ /*!**************************************************************!*\
  !*** ./src/react/components/Pages/PublicationTable/index.js ***!
  \**************************************************************/
    /*! exports provided: default */
    /***/ './src/react/components/Pages/PublicationTable/index.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module) {
        /* harmony import */ var _PublicationTable_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! ./PublicationTable.js */ './src/react/components/Pages/PublicationTable/PublicationTable.js',
        )
        /* harmony import */ var _PublicationTable_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! ./PublicationTable.scss */ './src/react/components/Pages/PublicationTable/PublicationTable.scss',
        )
        /* harmony import */ var _PublicationTable_scss__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(
          _PublicationTable_scss__WEBPACK_IMPORTED_MODULE_1__,
        )
        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        setTimeout(function() {
          console.assert(
            typeof _PublicationTable_js__WEBPACK_IMPORTED_MODULE_0__[
              'default'
            ] !== 'undefined',
            '[IMPORT]:',
            'PublicationTable',
            'from',
            './PublicationTable.js',
            'is undefined.',
          )
        }, 0)

        var _default =
          _PublicationTable_js__WEBPACK_IMPORTED_MODULE_0__['default']
        /* harmony default export */ __webpack_exports__['default'] = _default
        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            _default,
            'default',
            '/app/src/react/components/Pages/PublicationTable/index.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
      ))

      /***/
    },

    /***/ /*!*********************************************************************!*\
  !*** ./src/react/components/Pages/YearNavigation/YearNavigation.js ***!
  \*********************************************************************/
    /*! exports provided: default */
    /***/ './src/react/components/Pages/YearNavigation/YearNavigation.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module, R, React) {
        /* harmony import */ var redux_first_router_link__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! redux-first-router-link */ 'redux-first-router-link',
        )
        /* harmony import */ var redux_first_router_link__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
          redux_first_router_link__WEBPACK_IMPORTED_MODULE_0__,
        )
        /* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! classnames */ 'classnames',
        )
        /* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(
          classnames__WEBPACK_IMPORTED_MODULE_1__,
        )
        var _extends =
          Object.assign ||
          function(target) {
            for (var i = 1; i < arguments.length; i++) {
              var source = arguments[i]
              for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                  target[key] = source[key]
                }
              }
            }
            return target
          }

        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        function _objectWithoutProperties(obj, keys) {
          var target = {}
          for (var i in obj) {
            if (keys.indexOf(i) >= 0) continue
            if (!Object.prototype.hasOwnProperty.call(obj, i)) continue
            target[i] = obj[i]
          }
          return target
        }

        setTimeout(function() {
          console.assert(
            typeof redux_first_router_link__WEBPACK_IMPORTED_MODULE_0___default.a !==
              'undefined',
            '[IMPORT]:',
            'Link',
            'from',
            'redux-first-router-link',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof classnames__WEBPACK_IMPORTED_MODULE_1___default.a !==
              'undefined',
            '[IMPORT]:',
            'cx',
            'from',
            'classnames',
            'is undefined.',
          )
        }, 0)
        var YearLink = function YearLink(_ref) {
          var _ref$issues = _ref.issues,
            issues = _ref$issues === undefined ? [] : _ref$issues,
            year = _ref.year,
            toUrl = _ref.toUrl,
            className = _ref.className
          return R.find(R.propEq('year', year), issues)
            ? React.createElement(
                redux_first_router_link__WEBPACK_IMPORTED_MODULE_0___default.a,
                {
                  className: classnames__WEBPACK_IMPORTED_MODULE_1___default()(
                    'ok',
                    className,
                  ),
                  to: toUrl(year),
                },
                year,
              )
            : React.createElement(
                'span',
                {
                  className: classnames__WEBPACK_IMPORTED_MODULE_1___default()(
                    'empty',
                    className,
                  ),
                },
                year,
              )
        }

        var YearNavigation = function YearNavigation(_ref2) {
          var year = _ref2.year,
            props = _objectWithoutProperties(_ref2, ['year'])

          return React.createElement(
            'nav',
            { className: 'YearNavigation' },
            React.createElement(
              YearLink,
              _extends({ year: year - 1, className: 'last year' }, props),
            ),
            React.createElement('span', { className: 'current year' }, year),
            React.createElement(
              YearLink,
              _extends({ year: year + 1, className: 'next year' }, props),
            ),
          )
        }

        var _default = YearNavigation
        /* harmony default export */ __webpack_exports__['default'] = _default
        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            YearLink,
            'YearLink',
            '/app/src/react/components/Pages/YearNavigation/YearNavigation.js',
          )
          reactHotLoader.register(
            YearNavigation,
            'YearNavigation',
            '/app/src/react/components/Pages/YearNavigation/YearNavigation.js',
          )
          reactHotLoader.register(
            _default,
            'default',
            '/app/src/react/components/Pages/YearNavigation/YearNavigation.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
        __webpack_require__(/*! ramda */ 'ramda'),
        __webpack_require__(/*! react */ 'react'),
      ))

      /***/
    },

    /***/ /*!***********************************************************************!*\
  !*** ./src/react/components/Pages/YearNavigation/YearNavigation.scss ***!
  \***********************************************************************/
    /*! no static exports found */
    /***/ './src/react/components/Pages/YearNavigation/YearNavigation.scss': function(
      module,
      exports,
    ) {
      // empty (null-loader)
      /***/
    },

    /***/ /*!************************************************************!*\
  !*** ./src/react/components/Pages/YearNavigation/index.js ***!
  \************************************************************/
    /*! exports provided: default */
    /***/ './src/react/components/Pages/YearNavigation/index.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module) {
        /* harmony import */ var _YearNavigation_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! ./YearNavigation.js */ './src/react/components/Pages/YearNavigation/YearNavigation.js',
        )
        /* harmony import */ var _YearNavigation_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! ./YearNavigation.scss */ './src/react/components/Pages/YearNavigation/YearNavigation.scss',
        )
        /* harmony import */ var _YearNavigation_scss__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(
          _YearNavigation_scss__WEBPACK_IMPORTED_MODULE_1__,
        )
        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        setTimeout(function() {
          console.assert(
            typeof _YearNavigation_js__WEBPACK_IMPORTED_MODULE_0__[
              'default'
            ] !== 'undefined',
            '[IMPORT]:',
            'YearNavigation',
            'from',
            './YearNavigation.js',
            'is undefined.',
          )
        }, 0)

        var _default =
          _YearNavigation_js__WEBPACK_IMPORTED_MODULE_0__['default']
        /* harmony default export */ __webpack_exports__['default'] = _default
        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            _default,
            'default',
            '/app/src/react/components/Pages/YearNavigation/index.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
      ))

      /***/
    },

    /***/ /*!***********************************************!*\
  !*** ./src/react/components/Story/Story.scss ***!
  \***********************************************/
    /*! no static exports found */
    /***/ './src/react/components/Story/Story.scss': function(module, exports) {
      // empty (null-loader)
      /***/
    },

    /***/ /*!*************************************************!*\
  !*** ./src/react/components/Story/StoryBody.js ***!
  \*************************************************/
    /*! exports provided: default */
    /***/ './src/react/components/Story/StoryBody.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module, React, R) {
        /* harmony import */ var utils_text__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! utils/text */ './src/react/utils/text.js',
        )
        /* harmony import */ var _Tingo__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! ./Tingo */ './src/react/components/Story/Tingo.js',
        )
        /* harmony import */ var components_Debug__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          /*! components/Debug */ './src/react/components/Debug.js',
        )
        /* harmony import */ var _StoryImage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
          /*! ./StoryImage */ './src/react/components/Story/StoryImage.js',
        )
        /* harmony import */ var _StoryLink__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
          /*! ./StoryLink */ './src/react/components/Story/StoryLink.js',
        )
        var _extends =
          Object.assign ||
          function(target) {
            for (var i = 1; i < arguments.length; i++) {
              var source = arguments[i]
              for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                  target[key] = source[key]
                }
              }
            }
            return target
          }

        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        function _objectWithoutProperties(obj, keys) {
          var target = {}
          for (var i in obj) {
            if (keys.indexOf(i) >= 0) continue
            if (!Object.prototype.hasOwnProperty.call(obj, i)) continue
            target[i] = obj[i]
          }
          return target
        }

        setTimeout(function() {
          console.assert(
            typeof utils_text__WEBPACK_IMPORTED_MODULE_0__['toJson'] !==
              'undefined',
            '[IMPORT]:',
            'toJson',
            'from',
            'utils/text',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof _Tingo__WEBPACK_IMPORTED_MODULE_1__['default'] !==
              'undefined',
            '[IMPORT]:',
            'Tingo',
            'from',
            './Tingo',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof components_Debug__WEBPACK_IMPORTED_MODULE_2__['default'] !==
              'undefined',
            '[IMPORT]:',
            'Debug',
            'from',
            'components/Debug',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof _StoryImage__WEBPACK_IMPORTED_MODULE_3__['default'] !==
              'undefined',
            '[IMPORT]:',
            'StoryImage',
            'from',
            './StoryImage',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof _StoryLink__WEBPACK_IMPORTED_MODULE_4__['default'] !==
              'undefined',
            '[IMPORT]:',
            'StoryLink',
            'from',
            './StoryLink',
            'is undefined.',
          )
        }, 0)
        var SectionHeading = function SectionHeading(props) {
          return React.createElement(
            'h2',
            _extends({ className: 'SectionHeading' }, props),
          )
        }
        var Subheading = function Subheading(props) {
          return React.createElement(
            'h3',
            _extends({ className: 'Subheading' }, props),
          )
        }
        var AsideHeading = function AsideHeading(props) {
          return React.createElement(
            'h3',
            _extends({ className: 'AsideHeading' }, props),
          )
        }
        var Paragraph = function Paragraph(props) {
          return React.createElement(
            'p',
            _extends({ className: 'Paragraph' }, props),
          )
        }
        var Question = function Question(props) {
          return React.createElement(
            'p',
            _extends({ className: 'Question' }, props),
          )
        }
        var ListItem = function ListItem(props) {
          return React.createElement(
            'li',
            _extends({ className: 'ListItem' }, props),
          )
        }

        var PullQuote = function PullQuote(props) {
          return React.createElement(
            'blockquote',
            _extends({ className: 'PullQuote' }, props),
          )
        }
        var QuoteCit = function QuoteCit(props) {
          return React.createElement(
            'div',
            _extends({ className: 'QuoteCit' }, props),
          )
        }
        var Aside = function Aside(props) {
          return React.createElement(
            'aside',
            _extends({ className: 'Facts' }, props),
          )
        }

        var Place = function Place(_ref) {
          var name = _ref.name,
            props = _objectWithoutProperties(_ref, ['name'])

          return React.createElement(
            'section',
            _extends({ title: name, className: 'Place' }, props),
          )
        }

        var typeMap = {
          paragraph: Paragraph,
          place: Place,
          pullquote: PullQuote,
          link: _StoryLink__WEBPACK_IMPORTED_MODULE_4__['default'],
          aside: Aside,
          listItem: ListItem,
          image: _StoryImage__WEBPACK_IMPORTED_MODULE_3__['default'],
        }

        var tagMap = {
          tit: SectionHeading,
          mt: Subheading,
          txt: Paragraph,
          spm: Question,
          tingo: _Tingo__WEBPACK_IMPORTED_MODULE_1__['default'],
          sitatbyline: QuoteCit,
          faktatit: AsideHeading,
        }

        var renderNodes = R.addIndex(R.map)(
          R.ifElse(R.is(String), R.identity, function(node, idx) {
            var _node$children = node.children,
              children = _node$children === undefined ? [] : _node$children,
              props = _objectWithoutProperties(node, ['children'])

            var tag = props.tag,
              type = props.type

            var Component = tag ? tagMap[tag] : typeMap[type]
            return Component
              ? React.createElement(
                  Component,
                  _extends(
                    {
                      title: Object(
                        utils_text__WEBPACK_IMPORTED_MODULE_0__['toJson'],
                      )(node),
                    },
                    props,
                    { key: idx },
                  ),
                  renderNodes(children),
                )
              : React.createElement(
                  components_Debug__WEBPACK_IMPORTED_MODULE_2__['default'],
                  node,
                )
          }),
        )

        var StoryBody = function StoryBody(_ref2) {
          var bodytext_markup = _ref2.bodytext_markup,
            parseTree = _ref2.parseTree,
            nodeTree = _ref2.nodeTree,
            props = _objectWithoutProperties(_ref2, [
              'bodytext_markup',
              'parseTree',
              'nodeTree',
            ])

          return React.createElement('main', null, renderNodes(nodeTree))
        }

        var _default = StoryBody
        /* harmony default export */ __webpack_exports__['default'] = _default
        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            SectionHeading,
            'SectionHeading',
            '/app/src/react/components/Story/StoryBody.js',
          )
          reactHotLoader.register(
            Subheading,
            'Subheading',
            '/app/src/react/components/Story/StoryBody.js',
          )
          reactHotLoader.register(
            AsideHeading,
            'AsideHeading',
            '/app/src/react/components/Story/StoryBody.js',
          )
          reactHotLoader.register(
            Paragraph,
            'Paragraph',
            '/app/src/react/components/Story/StoryBody.js',
          )
          reactHotLoader.register(
            Question,
            'Question',
            '/app/src/react/components/Story/StoryBody.js',
          )
          reactHotLoader.register(
            ListItem,
            'ListItem',
            '/app/src/react/components/Story/StoryBody.js',
          )
          reactHotLoader.register(
            PullQuote,
            'PullQuote',
            '/app/src/react/components/Story/StoryBody.js',
          )
          reactHotLoader.register(
            QuoteCit,
            'QuoteCit',
            '/app/src/react/components/Story/StoryBody.js',
          )
          reactHotLoader.register(
            Aside,
            'Aside',
            '/app/src/react/components/Story/StoryBody.js',
          )
          reactHotLoader.register(
            Place,
            'Place',
            '/app/src/react/components/Story/StoryBody.js',
          )
          reactHotLoader.register(
            typeMap,
            'typeMap',
            '/app/src/react/components/Story/StoryBody.js',
          )
          reactHotLoader.register(
            tagMap,
            'tagMap',
            '/app/src/react/components/Story/StoryBody.js',
          )
          reactHotLoader.register(
            renderNodes,
            'renderNodes',
            '/app/src/react/components/Story/StoryBody.js',
          )
          reactHotLoader.register(
            StoryBody,
            'StoryBody',
            '/app/src/react/components/Story/StoryBody.js',
          )
          reactHotLoader.register(
            _default,
            'default',
            '/app/src/react/components/Story/StoryBody.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
        __webpack_require__(/*! react */ 'react'),
        __webpack_require__(/*! ramda */ 'ramda'),
      ))

      /***/
    },

    /***/ /*!*************************************************!*\
  !*** ./src/react/components/Story/StoryFoot.js ***!
  \*************************************************/
    /*! exports provided: default */
    /***/ './src/react/components/Story/StoryFoot.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module, React) {
        /* harmony import */ var ducks_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! ducks/router */ './src/react/ducks/router.js',
        )
        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError('Cannot call a class as a function')
          }
        }

        function _possibleConstructorReturn(self, call) {
          if (!self) {
            throw new ReferenceError(
              "this hasn't been initialised - super() hasn't been called",
            )
          }
          return call &&
            (typeof call === 'object' || typeof call === 'function')
            ? call
            : self
        }

        function _inherits(subClass, superClass) {
          if (typeof superClass !== 'function' && superClass !== null) {
            throw new TypeError(
              'Super expression must either be null or a function, not ' +
                typeof superClass,
            )
          }
          subClass.prototype = Object.create(
            superClass && superClass.prototype,
            {
              constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true,
              },
            },
          )
          if (superClass)
            Object.setPrototypeOf
              ? Object.setPrototypeOf(subClass, superClass)
              : (subClass.__proto__ = superClass)
        }

        setTimeout(function() {
          console.assert(
            typeof ducks_router__WEBPACK_IMPORTED_MODULE_0__['toStory'] !==
              'undefined',
            '[IMPORT]:',
            'toStory',
            'from',
            'ducks/router',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof ducks_router__WEBPACK_IMPORTED_MODULE_0__['reverse'] !==
              'undefined',
            '[IMPORT]:',
            'reverse',
            'from',
            'ducks/router',
            'is undefined.',
          )
        }, 0)

        var FacebookComments = (function(_React$Component) {
          _inherits(FacebookComments, _React$Component)

          function FacebookComments(props) {
            _classCallCheck(this, FacebookComments)

            var _this = _possibleConstructorReturn(
              this,
              _React$Component.call(this, props),
            )

            _this.element = React.createRef()
            var facebookParse = function facebookParse() {
              return (
                global.FB && global.FB.XFBML.parse(_this.element.parentElement)
              )
            }
            _this.componentDidMount = facebookParse
            _this.componentDidUpdate = facebookParse
            return _this
          }

          FacebookComments.prototype.shouldComponentUpdate = function shouldComponentUpdate(
            nextProps,
          ) {
            return nextProps.url != this.props.url
          }

          FacebookComments.prototype.render = function render() {
            return React.createElement('div', {
              className: 'fb-comments',
              'data-href': this.props.url,
              'data-numposts': 10,
              'data-width': '100%',
              ref: this.element,
            })
          }

          // @ts-ignore
          FacebookComments.prototype.__reactstandin__regenerateByEval = function __reactstandin__regenerateByEval(
            key,
            code,
          ) {
            // @ts-ignore
            this[key] = eval(code)
          }

          return FacebookComments
        })(React.Component)

        var StoryFoot = function StoryFoot(_ref) {
          var comment_field = _ref.comment_field,
            id = _ref.id,
            title = _ref.title,
            section = _ref.section

          var url =
            'http://universitas.no' +
            Object(ducks_router__WEBPACK_IMPORTED_MODULE_0__['reverse'])(
              Object(ducks_router__WEBPACK_IMPORTED_MODULE_0__['toStory'])({
                id: id,
                section: section,
                title: title,
              }),
            )

          return React.createElement(
            'footer',
            { className: 'StoryFoot' },
            comment_field == 'facebook' &&
              React.createElement(FacebookComments, { url: url }),
          )
        }

        var _default = StoryFoot
        /* harmony default export */ __webpack_exports__['default'] = _default
        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            FacebookComments,
            'FacebookComments',
            '/app/src/react/components/Story/StoryFoot.js',
          )
          reactHotLoader.register(
            StoryFoot,
            'StoryFoot',
            '/app/src/react/components/Story/StoryFoot.js',
          )
          reactHotLoader.register(
            _default,
            'default',
            '/app/src/react/components/Story/StoryFoot.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
        __webpack_require__(/*! react */ 'react'),
      ))

      /***/
    },

    /***/ /*!*************************************************!*\
  !*** ./src/react/components/Story/StoryHead.js ***!
  \*************************************************/
    /*! exports provided: default */
    /***/ './src/react/components/Story/StoryHead.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module, React, R) {
        /* harmony import */ var _StoryImage_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! ./StoryImage.js */ './src/react/components/Story/StoryImage.js',
        )
        /* harmony import */ var utils_text__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! utils/text */ './src/react/utils/text.js',
        )
        var _extends =
          Object.assign ||
          function(target) {
            for (var i = 1; i < arguments.length; i++) {
              var source = arguments[i]
              for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                  target[key] = source[key]
                }
              }
            }
            return target
          }

        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        function _objectWithoutProperties(obj, keys) {
          var target = {}
          for (var i in obj) {
            if (keys.indexOf(i) >= 0) continue
            if (!Object.prototype.hasOwnProperty.call(obj, i)) continue
            target[i] = obj[i]
          }
          return target
        }

        setTimeout(function() {
          console.assert(
            typeof _StoryImage_js__WEBPACK_IMPORTED_MODULE_0__['default'] !==
              'undefined',
            '[IMPORT]:',
            'StoryImage',
            'from',
            './StoryImage.js',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof utils_text__WEBPACK_IMPORTED_MODULE_1__['cleanText'] !==
              'undefined',
            '[IMPORT]:',
            'cleanText',
            'from',
            'utils/text',
            'is undefined.',
          )
        }, 0)
        var ifChildren = function ifChildren(Component) {
          return function(props) {
            return props.children ? React.createElement(Component, props) : null
          }
        }

        var Vignette = ifChildren(function(_ref) {
          var section = _ref.section,
            props = _objectWithoutProperties(_ref, ['section'])

          return React.createElement(
            'div',
            _extends(
              { className: cx('Vignette', 'section-' + section) },
              props,
            ),
          )
        })
        var Headline = ifChildren(function(props) {
          return React.createElement(
            'h1',
            _extends({ className: 'Headline' }, props),
          )
        })
        var Kicker = ifChildren(function(props) {
          return React.createElement(
            'h3',
            _extends({ className: 'Kicker' }, props),
          )
        })
        var Lede = ifChildren(function(props) {
          return React.createElement(
            'p',
            _extends({ className: 'Lede' }, props),
          )
        })

        var MainImage = R.pipe(
          R.prop('images'),
          R.find(R.pathEq(['placement'], 'head')),
          _StoryImage_js__WEBPACK_IMPORTED_MODULE_0__['default'],
          R.defaultTo(null),
        )

        var StoryHead = function StoryHead(_ref2) {
          var title = _ref2.title,
            kicker = _ref2.kicker,
            lede = _ref2.lede,
            props = _objectWithoutProperties(_ref2, ['title', 'kicker', 'lede'])

          return React.createElement(
            'div',
            { className: 'StoryHead' },
            React.createElement(MainImage, props),
            React.createElement(Kicker, null, kicker),
            React.createElement(
              Headline,
              null,
              Object(utils_text__WEBPACK_IMPORTED_MODULE_1__['cleanText'])(
                title,
              ),
            ),
            React.createElement(Lede, null, lede),
          )
        }

        var _default = StoryHead
        /* harmony default export */ __webpack_exports__['default'] = _default
        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            ifChildren,
            'ifChildren',
            '/app/src/react/components/Story/StoryHead.js',
          )
          reactHotLoader.register(
            Vignette,
            'Vignette',
            '/app/src/react/components/Story/StoryHead.js',
          )
          reactHotLoader.register(
            Headline,
            'Headline',
            '/app/src/react/components/Story/StoryHead.js',
          )
          reactHotLoader.register(
            Kicker,
            'Kicker',
            '/app/src/react/components/Story/StoryHead.js',
          )
          reactHotLoader.register(
            Lede,
            'Lede',
            '/app/src/react/components/Story/StoryHead.js',
          )
          reactHotLoader.register(
            MainImage,
            'MainImage',
            '/app/src/react/components/Story/StoryHead.js',
          )
          reactHotLoader.register(
            StoryHead,
            'StoryHead',
            '/app/src/react/components/Story/StoryHead.js',
          )
          reactHotLoader.register(
            _default,
            'default',
            '/app/src/react/components/Story/StoryHead.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
        __webpack_require__(/*! react */ 'react'),
        __webpack_require__(/*! ramda */ 'ramda'),
      ))

      /***/
    },

    /***/ /*!***************************************************!*\
  !*** ./src/react/components/Story/StoryHelmet.js ***!
  \***************************************************/
    /*! exports provided: default */
    /***/ './src/react/components/Story/StoryHelmet.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module, R, React) {
        /* harmony import */ var react_helmet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! react-helmet */ 'react-helmet',
        )
        /* harmony import */ var react_helmet__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
          react_helmet__WEBPACK_IMPORTED_MODULE_0__,
        )
        /* harmony import */ var ducks_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! ducks/router */ './src/react/ducks/router.js',
        )
        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        setTimeout(function() {
          console.assert(
            typeof react_helmet__WEBPACK_IMPORTED_MODULE_0__['Helmet'] !==
              'undefined',
            '[IMPORT]:',
            'Helmet',
            'from',
            'react-helmet',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof ducks_router__WEBPACK_IMPORTED_MODULE_1__['toShortUrl'] !==
              'undefined',
            '[IMPORT]:',
            'toShortUrl',
            'from',
            'ducks/router',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof ducks_router__WEBPACK_IMPORTED_MODULE_1__['toStory'] !==
              'undefined',
            '[IMPORT]:',
            'toStory',
            'from',
            'ducks/router',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof ducks_router__WEBPACK_IMPORTED_MODULE_1__['reverseFull'] !==
              'undefined',
            '[IMPORT]:',
            'reverseFull',
            'from',
            'ducks/router',
            'is undefined.',
          )
        }, 0)
        var STATUS_PUBLISHED = 10

        var authors = R.tryCatch(
          R.pipe(R.pluck('name'), R.join(', ')),
          R.always(console.error),
        )

        var StoryHelmet = function StoryHelmet(_ref) {
          var id = _ref.id,
            title = _ref.title,
            story_type = _ref.story_type,
            lede = _ref.lede,
            _ref$bylines = _ref.bylines,
            bylines = _ref$bylines === undefined ? [] : _ref$bylines,
            language = _ref.language,
            modified = _ref.modified,
            fb_image = _ref.fb_image,
            publication_status = _ref.publication_status
          return React.createElement(
            react_helmet__WEBPACK_IMPORTED_MODULE_0__['Helmet'],
            null,
            React.createElement(
              'title',
              null,
              title + ' | ' + story_type.name + ' | universitas.no',
            ),
            React.createElement('link', {
              rel: 'canonical',
              href: Object(
                ducks_router__WEBPACK_IMPORTED_MODULE_1__['reverseFull'],
              )(
                Object(ducks_router__WEBPACK_IMPORTED_MODULE_1__['toStory'])({
                  id: id,
                  title: title,
                  story_type: story_type,
                }),
              ),
            }),
            React.createElement('link', {
              rel: 'shortlink',
              href: Object(
                ducks_router__WEBPACK_IMPORTED_MODULE_1__['reverseFull'],
              )(
                Object(
                  ducks_router__WEBPACK_IMPORTED_MODULE_1__['toShortUrl'],
                )({ id: id }),
              ),
            }),
            React.createElement('meta', { name: 'description', content: lede }),
            React.createElement('meta', {
              name: 'author',
              content: authors(bylines),
            }),
            React.createElement('meta', {
              property: 'og:type',
              content: 'article',
            }),
            React.createElement('meta', {
              property: 'og:title',
              content: title,
            }),
            React.createElement('meta', {
              property: 'og:description',
              content: lede,
            }),
            React.createElement('meta', {
              property: 'og:locale',
              content: language,
            }),
            React.createElement('meta', {
              property: 'og:updated_time',
              content: modified,
            }),
            fb_image &&
              React.createElement('meta', {
                property: 'og:image',
                content: fb_image,
              }),
            publication_status != STATUS_PUBLISHED &&
              React.createElement('meta', {
                name: 'robots',
                content: 'noindex',
              }),
          )
        }

        var _default = StoryHelmet
        /* harmony default export */ __webpack_exports__['default'] = _default
        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            STATUS_PUBLISHED,
            'STATUS_PUBLISHED',
            '/app/src/react/components/Story/StoryHelmet.js',
          )
          reactHotLoader.register(
            authors,
            'authors',
            '/app/src/react/components/Story/StoryHelmet.js',
          )
          reactHotLoader.register(
            StoryHelmet,
            'StoryHelmet',
            '/app/src/react/components/Story/StoryHelmet.js',
          )
          reactHotLoader.register(
            _default,
            'default',
            '/app/src/react/components/Story/StoryHelmet.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
        __webpack_require__(/*! ramda */ 'ramda'),
        __webpack_require__(/*! react */ 'react'),
      ))

      /***/
    },

    /***/ /*!**************************************************!*\
  !*** ./src/react/components/Story/StoryImage.js ***!
  \**************************************************/
    /*! exports provided: default */
    /***/ './src/react/components/Story/StoryImage.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module, R, React) {
        /* harmony import */ var _StoryImage_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! ./StoryImage.scss */ './src/react/components/Story/StoryImage.scss',
        )
        /* harmony import */ var _StoryImage_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
          _StoryImage_scss__WEBPACK_IMPORTED_MODULE_0__,
        )
        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        var position = function position(_ref) {
          var _ref$x = _ref.x,
            x = _ref$x === undefined ? 0.5 : _ref$x,
            _ref$y = _ref.y,
            y = _ref$y === undefined ? 0.5 : _ref$y
          return x * 100 + '% ' + y * 100 + '%'
        }

        var Caption = function Caption(_ref2) {
          var caption = _ref2.caption,
            creditline = _ref2.creditline

          if (!(caption || creditline)) return null
          var match = R.match(/^([^:.\n]*:)(.*)$/, caption)
          var intro = ''
          if (match) {
            intro = match[1]
            caption = match[2]
          }

          return React.createElement(
            'div',
            { className: 'Caption' },
            intro &&
              React.createElement('strong', { className: 'stikk' }, intro),
            caption,
            creditline &&
              React.createElement(
                'span',
                { className: 'creditline' },
                creditline,
              ),
          )
        }

        var Image = function Image(_ref3) {
          var id = _ref3.id,
            cropped = _ref3.cropped,
            large = _ref3.large,
            aspect_ratio = _ref3.aspect_ratio,
            caption = _ref3.caption,
            _ref3$crop_box = _ref3.crop_box,
            crop_box = _ref3$crop_box === undefined ? {} : _ref3$crop_box
          return id
            ? React.createElement(
                'div',
                { className: 'imgWrapper' },
                React.createElement('img', {
                  style: {
                    objectPosition: position(crop_box),
                  },
                  src: cropped || large,
                  alt: caption,
                }),
              )
            : null
        }

        var StoryImage = function StoryImage(props) {
          return React.createElement(
            'div',
            { className: 'StoryImage' },
            React.createElement(Image, props),
            React.createElement(Caption, props),
          )
        }

        var _default = StoryImage
        /* harmony default export */ __webpack_exports__['default'] = _default
        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            position,
            'position',
            '/app/src/react/components/Story/StoryImage.js',
          )
          reactHotLoader.register(
            Caption,
            'Caption',
            '/app/src/react/components/Story/StoryImage.js',
          )
          reactHotLoader.register(
            Image,
            'Image',
            '/app/src/react/components/Story/StoryImage.js',
          )
          reactHotLoader.register(
            StoryImage,
            'StoryImage',
            '/app/src/react/components/Story/StoryImage.js',
          )
          reactHotLoader.register(
            _default,
            'default',
            '/app/src/react/components/Story/StoryImage.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
        __webpack_require__(/*! ramda */ 'ramda'),
        __webpack_require__(/*! react */ 'react'),
      ))

      /***/
    },

    /***/ /*!****************************************************!*\
  !*** ./src/react/components/Story/StoryImage.scss ***!
  \****************************************************/
    /*! no static exports found */
    /***/ './src/react/components/Story/StoryImage.scss': function(
      module,
      exports,
    ) {
      // empty (null-loader)
      /***/
    },

    /***/ /*!*************************************************!*\
  !*** ./src/react/components/Story/StoryLink.js ***!
  \*************************************************/
    /*! exports provided: default */
    /***/ './src/react/components/Story/StoryLink.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module, React, R) {
        /* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! react-redux */ 'react-redux',
        )
        /* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
          react_redux__WEBPACK_IMPORTED_MODULE_0__,
        )
        /* harmony import */ var ducks_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! ducks/router */ './src/react/ducks/router.js',
        )
        /* harmony import */ var ducks_publicstory__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          /*! ducks/publicstory */ './src/react/ducks/publicstory.js',
        )
        /* harmony import */ var redux_first_router_link__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
          /*! redux-first-router-link */ 'redux-first-router-link',
        )
        /* harmony import */ var redux_first_router_link__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/ __webpack_require__.n(
          redux_first_router_link__WEBPACK_IMPORTED_MODULE_3__,
        )
        var _extends =
          Object.assign ||
          function(target) {
            for (var i = 1; i < arguments.length; i++) {
              var source = arguments[i]
              for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                  target[key] = source[key]
                }
              }
            }
            return target
          }

        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        function _objectWithoutProperties(obj, keys) {
          var target = {}
          for (var i in obj) {
            if (keys.indexOf(i) >= 0) continue
            if (!Object.prototype.hasOwnProperty.call(obj, i)) continue
            target[i] = obj[i]
          }
          return target
        }

        setTimeout(function() {
          console.assert(
            typeof react_redux__WEBPACK_IMPORTED_MODULE_0__['connect'] !==
              'undefined',
            '[IMPORT]:',
            'connect',
            'from',
            'react-redux',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof ducks_router__WEBPACK_IMPORTED_MODULE_1__['toShortUrl'] !==
              'undefined',
            '[IMPORT]:',
            'toShortUrl',
            'from',
            'ducks/router',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof ducks_router__WEBPACK_IMPORTED_MODULE_1__['toStory'] !==
              'undefined',
            '[IMPORT]:',
            'toStory',
            'from',
            'ducks/router',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof ducks_publicstory__WEBPACK_IMPORTED_MODULE_2__[
              'storyRequested'
            ] !== 'undefined',
            '[IMPORT]:',
            'storyRequested',
            'from',
            'ducks/publicstory',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof ducks_publicstory__WEBPACK_IMPORTED_MODULE_2__[
              'getStory'
            ] !== 'undefined',
            '[IMPORT]:',
            'getStory',
            'from',
            'ducks/publicstory',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof redux_first_router_link__WEBPACK_IMPORTED_MODULE_3___default.a !==
              'undefined',
            '[IMPORT]:',
            'RouterLink',
            'from',
            'redux-first-router-link',
            'is undefined.',
          )
        }, 0)
        var StoryLink = function StoryLink(_ref) {
          var href = _ref.href,
            story = _ref.story,
            id = _ref.id,
            storyRequested = _ref.storyRequested,
            props = _objectWithoutProperties(_ref, [
              'href',
              'story',
              'id',
              'storyRequested',
            ])

          return story
            ? story.id
              ? React.createElement(
                  redux_first_router_link__WEBPACK_IMPORTED_MODULE_3___default.a,
                  _extends(
                    {
                      ref: function ref() {
                        return console.log(story)
                      },
                      to: Object(
                        ducks_router__WEBPACK_IMPORTED_MODULE_1__['toStory'],
                      )(story),
                    },
                    props,
                  ),
                )
              : React.createElement(
                  redux_first_router_link__WEBPACK_IMPORTED_MODULE_3___default.a,
                  _extends(
                    {
                      to: Object(
                        ducks_router__WEBPACK_IMPORTED_MODULE_1__['toShortUrl'],
                      )({ id: id }),
                      onMouseOver: function onMouseOver() {
                        return story.fetching || storyRequested(id, true)
                      },
                    },
                    props,
                  ),
                )
            : React.createElement(
                'a',
                _extends(
                  {
                    style: { textDecoration: 'underline' },
                    href: href,
                    title: href,
                  },
                  props,
                ),
              )
        }

        var mapStateToProps = function mapStateToProps(state, props) {
          var id = R.path(['link', 'linked_story'], props)
          var href = R.path(['link', 'href'], props)
          console.log({ id: id, href: href })
          if (id)
            return {
              id: id,
              story:
                Object(
                  ducks_publicstory__WEBPACK_IMPORTED_MODULE_2__['getStory'],
                )(id)(state) || {},
            }
          return { href: href }
        }
        var mapDispatchToProps = {
          storyRequested:
            ducks_publicstory__WEBPACK_IMPORTED_MODULE_2__['storyRequested'],
        }

        var _default = Object(
          react_redux__WEBPACK_IMPORTED_MODULE_0__['connect'],
        )(mapStateToProps, mapDispatchToProps)(StoryLink)

        /* harmony default export */ __webpack_exports__['default'] = _default
        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            StoryLink,
            'StoryLink',
            '/app/src/react/components/Story/StoryLink.js',
          )
          reactHotLoader.register(
            mapStateToProps,
            'mapStateToProps',
            '/app/src/react/components/Story/StoryLink.js',
          )
          reactHotLoader.register(
            mapDispatchToProps,
            'mapDispatchToProps',
            '/app/src/react/components/Story/StoryLink.js',
          )
          reactHotLoader.register(
            _default,
            'default',
            '/app/src/react/components/Story/StoryLink.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
        __webpack_require__(/*! react */ 'react'),
        __webpack_require__(/*! ramda */ 'ramda'),
      ))

      /***/
    },

    /***/ /*!****************************************************!*\
  !*** ./src/react/components/Story/StorySidebar.js ***!
  \****************************************************/
    /*! exports provided: default */
    /***/ './src/react/components/Story/StorySidebar.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module, React, R) {
        /* harmony import */ var utils_text__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! utils/text */ './src/react/utils/text.js',
        )
        var _extends =
          Object.assign ||
          function(target) {
            for (var i = 1; i < arguments.length; i++) {
              var source = arguments[i]
              for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                  target[key] = source[key]
                }
              }
            }
            return target
          }

        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        function _objectWithoutProperties(obj, keys) {
          var target = {}
          for (var i in obj) {
            if (keys.indexOf(i) >= 0) continue
            if (!Object.prototype.hasOwnProperty.call(obj, i)) continue
            target[i] = obj[i]
          }
          return target
        }

        setTimeout(function() {
          console.assert(
            typeof utils_text__WEBPACK_IMPORTED_MODULE_0__['formatDate'] !==
              'undefined',
            '[IMPORT]:',
            'formatDate',
            'from',
            'utils/text',
            'is undefined.',
          )
        }, 0)
        var DateLine = function DateLine(_ref) {
          var publication_date = _ref.publication_date
          return React.createElement(
            'div',
            { className: 'DateLine' },
            Object(utils_text__WEBPACK_IMPORTED_MODULE_0__['formatDate'])(
              publication_date,
            ),
          )
        }

        var creditDisplay = function creditDisplay(credit) {
          return (
            {
              by: 'Av',
              text: 'Tekst',
              video: 'Video',
              photo: 'Foto',
              illustration: 'Illustrasjon',
              graphics: 'Grafikk',
              translation: 'Oversettelse',
              'text and photo': 'Tekst og foto',
              'text and video': 'Tekst og video',
              'photo and video': 'Foto og video',
            }[credit] || credit
          )
        }

        var StoryInfo = function StoryInfo(_ref2) {
          var theme_word = _ref2.theme_word,
            story_type = _ref2.story_type
          return React.createElement(
            'div',
            { className: 'StoryInfo' },
            React.createElement(
              'div',
              { className: 'storytype' },
              story_type.name,
            ),
            React.createElement('div', { className: 'themeword' }, theme_word),
          )
        }

        var Byline = function Byline(_ref3) {
          var credit = _ref3.credit,
            name = _ref3.name,
            title = _ref3.title,
            contributor = _ref3.contributor,
            thumb = _ref3.thumb
          return React.createElement(
            'div',
            { className: 'Byline' },
            thumb &&
              React.createElement('img', {
                className: 'face',
                src: thumb,
                alt: name,
              }),
            !title &&
              credit &&
              React.createElement(
                'div',
                { className: 'credit' },
                creditDisplay(credit),
                ':',
              ),
            React.createElement('div', { className: 'name' }, name),
            title && React.createElement('div', { className: 'title' }, title),
          )
        }

        var Bylines = function Bylines(_ref4) {
          var bylines = _ref4.bylines
          return R.pipe(
            R.sortBy(R.prop('ordering')),
            R.map(function(props) {
              return React.createElement(
                Byline,
                _extends({ key: props.contributor }, props),
              )
            }),
          )(bylines)
        }

        var StorySidebar = function StorySidebar(_ref5) {
          var _ref5$bylines = _ref5.bylines,
            bylines = _ref5$bylines === undefined ? [] : _ref5$bylines,
            props = _objectWithoutProperties(_ref5, ['bylines'])

          return React.createElement(
            'section',
            { className: 'StorySidebar' },
            React.createElement(StoryInfo, props),
            React.createElement(DateLine, props),
            React.createElement(Bylines, { bylines: bylines }),
          )
        }

        var _default = StorySidebar
        /* harmony default export */ __webpack_exports__['default'] = _default
        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            DateLine,
            'DateLine',
            '/app/src/react/components/Story/StorySidebar.js',
          )
          reactHotLoader.register(
            creditDisplay,
            'creditDisplay',
            '/app/src/react/components/Story/StorySidebar.js',
          )
          reactHotLoader.register(
            StoryInfo,
            'StoryInfo',
            '/app/src/react/components/Story/StorySidebar.js',
          )
          reactHotLoader.register(
            Byline,
            'Byline',
            '/app/src/react/components/Story/StorySidebar.js',
          )
          reactHotLoader.register(
            Bylines,
            'Bylines',
            '/app/src/react/components/Story/StorySidebar.js',
          )
          reactHotLoader.register(
            StorySidebar,
            'StorySidebar',
            '/app/src/react/components/Story/StorySidebar.js',
          )
          reactHotLoader.register(
            _default,
            'default',
            '/app/src/react/components/Story/StorySidebar.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
        __webpack_require__(/*! react */ 'react'),
        __webpack_require__(/*! ramda */ 'ramda'),
      ))

      /***/
    },

    /***/ /*!*********************************************!*\
  !*** ./src/react/components/Story/Tingo.js ***!
  \*********************************************/
    /*! exports provided: default */
    /***/ './src/react/components/Story/Tingo.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module, R, React) {
        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        var splitter = function splitter(n) {
          var re = RegExp('^([^\\n:?!.]{0,' + n + '}\\S*)(.*)$')
          return R.pipe(function(t) {
            return re.exec(t)
          }, R.tail)
        }

        var splitTingo = R.curry(function(split) {
          return R.pipe(
            R.unless(R.is(Array), R.of),
            R.over(R.lensIndex(0), R.when(R.is(String), split)),
            R.flatten,
            R.filter(Boolean),
          )
        })

        var Tingo = function Tingo(_ref) {
          var children = _ref.children,
            _ref$length = _ref.length,
            length = _ref$length === undefined ? 15 : _ref$length

          var _splitTingo = splitTingo(splitter(length))(children),
            first = _splitTingo[0],
            rest = _splitTingo.slice(1)

          return React.createElement(
            'p',
            { className: 'Tingo' },
            React.createElement('strong', null, first),
            rest || null,
          )
        }

        var _default = Tingo
        /* harmony default export */ __webpack_exports__['default'] = _default
        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            splitter,
            'splitter',
            '/app/src/react/components/Story/Tingo.js',
          )
          reactHotLoader.register(
            splitTingo,
            'splitTingo',
            '/app/src/react/components/Story/Tingo.js',
          )
          reactHotLoader.register(
            Tingo,
            'Tingo',
            '/app/src/react/components/Story/Tingo.js',
          )
          reactHotLoader.register(
            _default,
            'default',
            '/app/src/react/components/Story/Tingo.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
        __webpack_require__(/*! ramda */ 'ramda'),
        __webpack_require__(/*! react */ 'react'),
      ))

      /***/
    },

    /***/ /*!*********************************************!*\
  !*** ./src/react/components/Story/index.js ***!
  \*********************************************/
    /*! exports provided: Story, default */
    /***/ './src/react/components/Story/index.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module, React) {
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'Story',
          function() {
            return Story
          },
        )
        /* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! react-redux */ 'react-redux',
        )
        /* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
          react_redux__WEBPACK_IMPORTED_MODULE_0__,
        )
        /* harmony import */ var components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! components/LoadingIndicator */ './src/react/components/LoadingIndicator/index.js',
        )
        /* harmony import */ var utils_hoc__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          /*! utils/hoc */ './src/react/utils/hoc.js',
        )
        /* harmony import */ var ducks_publicstory__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
          /*! ducks/publicstory */ './src/react/ducks/publicstory.js',
        )
        /* harmony import */ var ducks_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
          /*! ducks/router */ './src/react/ducks/router.js',
        )
        /* harmony import */ var redux_first_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
          /*! redux-first-router */ 'redux-first-router',
        )
        /* harmony import */ var redux_first_router__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/ __webpack_require__.n(
          redux_first_router__WEBPACK_IMPORTED_MODULE_5__,
        )
        /* harmony import */ var _StoryHelmet_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
          /*! ./StoryHelmet.js */ './src/react/components/Story/StoryHelmet.js',
        )
        /* harmony import */ var _StoryHead_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
          /*! ./StoryHead.js */ './src/react/components/Story/StoryHead.js',
        )
        /* harmony import */ var _StoryBody_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(
          /*! ./StoryBody.js */ './src/react/components/Story/StoryBody.js',
        )
        /* harmony import */ var _StorySidebar_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(
          /*! ./StorySidebar.js */ './src/react/components/Story/StorySidebar.js',
        )
        /* harmony import */ var _StoryFoot_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(
          /*! ./StoryFoot.js */ './src/react/components/Story/StoryFoot.js',
        )
        /* harmony import */ var components_PageNotFound__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(
          /*! components/PageNotFound */ './src/react/components/PageNotFound/index.js',
        )
        /* harmony import */ var components_Debug__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(
          /*! components/Debug */ './src/react/components/Debug.js',
        )
        /* harmony import */ var _Story_scss__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(
          /*! ./Story.scss */ './src/react/components/Story/Story.scss',
        )
        /* harmony import */ var _Story_scss__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/ __webpack_require__.n(
          _Story_scss__WEBPACK_IMPORTED_MODULE_13__,
        )
        var _extends =
          Object.assign ||
          function(target) {
            for (var i = 1; i < arguments.length; i++) {
              var source = arguments[i]
              for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                  target[key] = source[key]
                }
              }
            }
            return target
          }

        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        function _objectWithoutProperties(obj, keys) {
          var target = {}
          for (var i in obj) {
            if (keys.indexOf(i) >= 0) continue
            if (!Object.prototype.hasOwnProperty.call(obj, i)) continue
            target[i] = obj[i]
          }
          return target
        }

        setTimeout(function() {
          console.assert(
            typeof react_redux__WEBPACK_IMPORTED_MODULE_0__['connect'] !==
              'undefined',
            '[IMPORT]:',
            'connect',
            'from',
            'react-redux',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_1__[
              'default'
            ] !== 'undefined',
            '[IMPORT]:',
            'LoadingIndicator',
            'from',
            'components/LoadingIndicator',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof utils_hoc__WEBPACK_IMPORTED_MODULE_2__['requestData'] !==
              'undefined',
            '[IMPORT]:',
            'requestData',
            'from',
            'utils/hoc',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof ducks_publicstory__WEBPACK_IMPORTED_MODULE_3__[
              'storyRequested'
            ] !== 'undefined',
            '[IMPORT]:',
            'storyRequested',
            'from',
            'ducks/publicstory',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof ducks_publicstory__WEBPACK_IMPORTED_MODULE_3__[
              'getStory'
            ] !== 'undefined',
            '[IMPORT]:',
            'getStory',
            'from',
            'ducks/publicstory',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof ducks_router__WEBPACK_IMPORTED_MODULE_4__['toStory'] !==
              'undefined',
            '[IMPORT]:',
            'toStory',
            'from',
            'ducks/router',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof ducks_router__WEBPACK_IMPORTED_MODULE_4__['reverse'] !==
              'undefined',
            '[IMPORT]:',
            'reverse',
            'from',
            'ducks/router',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof redux_first_router__WEBPACK_IMPORTED_MODULE_5__[
              'redirect'
            ] !== 'undefined',
            '[IMPORT]:',
            'redirect',
            'from',
            'redux-first-router',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof _StoryHelmet_js__WEBPACK_IMPORTED_MODULE_6__['default'] !==
              'undefined',
            '[IMPORT]:',
            'StoryHelmet',
            'from',
            './StoryHelmet.js',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof _StoryHead_js__WEBPACK_IMPORTED_MODULE_7__['default'] !==
              'undefined',
            '[IMPORT]:',
            'StoryHead',
            'from',
            './StoryHead.js',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof _StoryBody_js__WEBPACK_IMPORTED_MODULE_8__['default'] !==
              'undefined',
            '[IMPORT]:',
            'StoryBody',
            'from',
            './StoryBody.js',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof _StorySidebar_js__WEBPACK_IMPORTED_MODULE_9__['default'] !==
              'undefined',
            '[IMPORT]:',
            'StorySidebar',
            'from',
            './StorySidebar.js',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof _StoryFoot_js__WEBPACK_IMPORTED_MODULE_10__['default'] !==
              'undefined',
            '[IMPORT]:',
            'StoryFoot',
            'from',
            './StoryFoot.js',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof components_PageNotFound__WEBPACK_IMPORTED_MODULE_11__[
              'default'
            ] !== 'undefined',
            '[IMPORT]:',
            'PageNotFound',
            'from',
            'components/PageNotFound',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof components_Debug__WEBPACK_IMPORTED_MODULE_12__['default'] !==
              'undefined',
            '[IMPORT]:',
            'Debug',
            'from',
            'components/Debug',
            'is undefined.',
          )
        }, 0)

        var Story = function Story(props) {
          return React.createElement(
            'article',
            { className: 'Story' },
            React.createElement(
              _StoryHead_js__WEBPACK_IMPORTED_MODULE_7__['default'],
              props,
            ),
            React.createElement(
              'main',
              { className: 'mainContent' },
              React.createElement(
                _StorySidebar_js__WEBPACK_IMPORTED_MODULE_9__['default'],
                props,
              ),
              React.createElement(
                _StoryBody_js__WEBPACK_IMPORTED_MODULE_8__['default'],
                props,
              ),
            ),
            React.createElement(
              _StoryFoot_js__WEBPACK_IMPORTED_MODULE_10__['default'],
              props,
            ),
          )
        }

        var StoryRoute = function StoryRoute(_ref) {
          var redirect = _ref.redirect,
            props = _objectWithoutProperties(_ref, ['redirect'])

          if (props.HTTPstatus == 404)
            return React.createElement(
              components_PageNotFound__WEBPACK_IMPORTED_MODULE_11__['default'],
              props,
              'Fant ikke saken',
            )

          var routeAction = Object(
            ducks_router__WEBPACK_IMPORTED_MODULE_4__['toStory'],
          )(props)
          if (
            props.pathname !=
            Object(ducks_router__WEBPACK_IMPORTED_MODULE_4__['reverse'])(
              routeAction,
            )
          ) {
            redirect(routeAction)
            return null
          }
          return [
            React.createElement(
              _StoryHelmet_js__WEBPACK_IMPORTED_MODULE_6__['default'],
              _extends({ key: 'helmet' }, props),
            ),
            React.createElement(Story, _extends({ key: 'story' }, props)),
          ]
        }

        var mapStateToProps = function mapStateToProps(state, _ref2) {
          var id = _ref2.id
          return (
            Object(ducks_publicstory__WEBPACK_IMPORTED_MODULE_3__['getStory'])(
              id,
            )(state) || {}
          )
        }
        var mapDispatchToProps = function mapDispatchToProps(dispatch, _ref3) {
          var id = _ref3.id
          return {
            fetchData: function fetchData() {
              return dispatch(
                Object(
                  ducks_publicstory__WEBPACK_IMPORTED_MODULE_3__[
                    'storyRequested'
                  ],
                )(id),
              )
            },
            redirect: function redirect(routeAction) {
              return dispatch(
                Object(
                  redux_first_router__WEBPACK_IMPORTED_MODULE_5__['redirect'],
                )(routeAction),
              )
            },
          }
        }

        var _default = Object(
          react_redux__WEBPACK_IMPORTED_MODULE_0__['connect'],
        )(mapStateToProps, mapDispatchToProps)(
          Object(utils_hoc__WEBPACK_IMPORTED_MODULE_2__['requestData'])(
            StoryRoute,
            'url',
            components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_1__['default'],
          ),
        )

        /* harmony default export */ __webpack_exports__['default'] = _default
        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            Story,
            'Story',
            '/app/src/react/components/Story/index.js',
          )
          reactHotLoader.register(
            StoryRoute,
            'StoryRoute',
            '/app/src/react/components/Story/index.js',
          )
          reactHotLoader.register(
            mapStateToProps,
            'mapStateToProps',
            '/app/src/react/components/Story/index.js',
          )
          reactHotLoader.register(
            mapDispatchToProps,
            'mapDispatchToProps',
            '/app/src/react/components/Story/index.js',
          )
          reactHotLoader.register(
            _default,
            'default',
            '/app/src/react/components/Story/index.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
        __webpack_require__(/*! react */ 'react'),
      ))

      /***/
    },

    /***/ /*!********************************************************!*\
  !*** ./src/react/components/TopMenu/LanguageWidget.js ***!
  \********************************************************/
    /*! exports provided: default */
    /***/ './src/react/components/TopMenu/LanguageWidget.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module, React) {
        /* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! react-redux */ 'react-redux',
        )
        /* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
          react_redux__WEBPACK_IMPORTED_MODULE_0__,
        )
        /* harmony import */ var ducks_newsFeed__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! ducks/newsFeed */ './src/react/ducks/newsFeed.js',
        )
        /* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          /*! classnames */ 'classnames',
        )
        /* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/ __webpack_require__.n(
          classnames__WEBPACK_IMPORTED_MODULE_2__,
        )
        var _extends =
          Object.assign ||
          function(target) {
            for (var i = 1; i < arguments.length; i++) {
              var source = arguments[i]
              for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                  target[key] = source[key]
                }
              }
            }
            return target
          }

        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        setTimeout(function() {
          console.assert(
            typeof react_redux__WEBPACK_IMPORTED_MODULE_0__['connect'] !==
              'undefined',
            '[IMPORT]:',
            'connect',
            'from',
            'react-redux',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof ducks_newsFeed__WEBPACK_IMPORTED_MODULE_1__[
              'toggleLanguage'
            ] !== 'undefined',
            '[IMPORT]:',
            'toggleLanguage',
            'from',
            'ducks/newsFeed',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof ducks_newsFeed__WEBPACK_IMPORTED_MODULE_1__[
              'getLanguage'
            ] !== 'undefined',
            '[IMPORT]:',
            'getLanguage',
            'from',
            'ducks/newsFeed',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof classnames__WEBPACK_IMPORTED_MODULE_2___default.a !==
              'undefined',
            '[IMPORT]:',
            'cx',
            'from',
            'classnames',
            'is undefined.',
          )
        }, 0)
        var LanguageButton = function LanguageButton(_ref) {
          var code = _ref.code,
            language = _ref.language,
            toggleLanguage = _ref.toggleLanguage
          return React.createElement(
            'div',
            {
              className: classnames__WEBPACK_IMPORTED_MODULE_2___default()(
                'LanguageButton',
                { active: code == language },
              ),
              onClick: function onClick() {
                return toggleLanguage(code)
              },
            },
            code,
          )
        }

        var LanguageWidget = function LanguageWidget(props) {
          return React.createElement(
            'nav',
            { className: 'LanguageWidget' },
            React.createElement(
              LanguageButton,
              _extends({ code: 'nor' }, props),
            ),
            React.createElement(
              LanguageButton,
              _extends({ code: 'eng' }, props),
            ),
          )
        }

        var _default = Object(
          react_redux__WEBPACK_IMPORTED_MODULE_0__['connect'],
        )(
          function(state) {
            return {
              language: Object(
                ducks_newsFeed__WEBPACK_IMPORTED_MODULE_1__['getLanguage'],
              )(state),
            }
          },
          {
            toggleLanguage:
              ducks_newsFeed__WEBPACK_IMPORTED_MODULE_1__['toggleLanguage'],
          },
        )(LanguageWidget)

        /* harmony default export */ __webpack_exports__['default'] = _default
        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            LanguageButton,
            'LanguageButton',
            '/app/src/react/components/TopMenu/LanguageWidget.js',
          )
          reactHotLoader.register(
            LanguageWidget,
            'LanguageWidget',
            '/app/src/react/components/TopMenu/LanguageWidget.js',
          )
          reactHotLoader.register(
            _default,
            'default',
            '/app/src/react/components/TopMenu/LanguageWidget.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
        __webpack_require__(/*! react */ 'react'),
      ))

      /***/
    },

    /***/ /*!**********************************************!*\
  !*** ./src/react/components/TopMenu/Menu.js ***!
  \**********************************************/
    /*! exports provided: default */
    /***/ './src/react/components/TopMenu/Menu.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module, React) {
        /* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! classnames */ 'classnames',
        )
        /* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
          classnames__WEBPACK_IMPORTED_MODULE_0__,
        )
        /* harmony import */ var redux_first_router_link__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! redux-first-router-link */ 'redux-first-router-link',
        )
        /* harmony import */ var redux_first_router_link__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(
          redux_first_router_link__WEBPACK_IMPORTED_MODULE_1__,
        )
        /* harmony import */ var components_Logos__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          /*! components/Logos */ './src/react/components/Logos/index.js',
        )
        /* harmony import */ var _Sections_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
          /*! ./Sections.js */ './src/react/components/TopMenu/Sections.js',
        )
        /* harmony import */ var react_error_boundary__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
          /*! react-error-boundary */ 'react-error-boundary',
        )
        /* harmony import */ var react_error_boundary__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/ __webpack_require__.n(
          react_error_boundary__WEBPACK_IMPORTED_MODULE_4__,
        )
        /* harmony import */ var ducks_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
          /*! ducks/router */ './src/react/ducks/router.js',
        )
        /* harmony import */ var _LanguageWidget_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
          /*! ./LanguageWidget.js */ './src/react/components/TopMenu/LanguageWidget.js',
        )
        /* harmony import */ var _SearchWidget_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
          /*! ./SearchWidget.js */ './src/react/components/TopMenu/SearchWidget.js',
        )
        /* harmony import */ var components_Icons__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(
          /*! components/Icons */ './src/react/components/Icons.js',
        )
        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError('Cannot call a class as a function')
          }
        }

        function _possibleConstructorReturn(self, call) {
          if (!self) {
            throw new ReferenceError(
              "this hasn't been initialised - super() hasn't been called",
            )
          }
          return call &&
            (typeof call === 'object' || typeof call === 'function')
            ? call
            : self
        }

        function _inherits(subClass, superClass) {
          if (typeof superClass !== 'function' && superClass !== null) {
            throw new TypeError(
              'Super expression must either be null or a function, not ' +
                typeof superClass,
            )
          }
          subClass.prototype = Object.create(
            superClass && superClass.prototype,
            {
              constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true,
              },
            },
          )
          if (superClass)
            Object.setPrototypeOf
              ? Object.setPrototypeOf(subClass, superClass)
              : (subClass.__proto__ = superClass)
        }

        function _objectWithoutProperties(obj, keys) {
          var target = {}
          for (var i in obj) {
            if (keys.indexOf(i) >= 0) continue
            if (!Object.prototype.hasOwnProperty.call(obj, i)) continue
            target[i] = obj[i]
          }
          return target
        }

        setTimeout(function() {
          console.assert(
            typeof classnames__WEBPACK_IMPORTED_MODULE_0___default.a !==
              'undefined',
            '[IMPORT]:',
            'cx',
            'from',
            'classnames',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof redux_first_router_link__WEBPACK_IMPORTED_MODULE_1__[
              'NavLink'
            ] !== 'undefined',
            '[IMPORT]:',
            'NavLink',
            'from',
            'redux-first-router-link',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof redux_first_router_link__WEBPACK_IMPORTED_MODULE_1___default.a !==
              'undefined',
            '[IMPORT]:',
            'Link',
            'from',
            'redux-first-router-link',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof components_Logos__WEBPACK_IMPORTED_MODULE_2__[
              'Universitas'
            ] !== 'undefined',
            '[IMPORT]:',
            'Universitas',
            'from',
            'components/Logos',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof _Sections_js__WEBPACK_IMPORTED_MODULE_3__['default'] !==
              'undefined',
            '[IMPORT]:',
            'Sections',
            'from',
            './Sections.js',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof react_error_boundary__WEBPACK_IMPORTED_MODULE_4___default.a !==
              'undefined',
            '[IMPORT]:',
            'ErrorBoundary',
            'from',
            'react-error-boundary',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof ducks_router__WEBPACK_IMPORTED_MODULE_5__['toAdInfo'] !==
              'undefined',
            '[IMPORT]:',
            'toAdInfo',
            'from',
            'ducks/router',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof ducks_router__WEBPACK_IMPORTED_MODULE_5__['toAbout'] !==
              'undefined',
            '[IMPORT]:',
            'toAbout',
            'from',
            'ducks/router',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof ducks_router__WEBPACK_IMPORTED_MODULE_5__[
              'toPubSchedule'
            ] !== 'undefined',
            '[IMPORT]:',
            'toPubSchedule',
            'from',
            'ducks/router',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof ducks_router__WEBPACK_IMPORTED_MODULE_5__['toPdf'] !==
              'undefined',
            '[IMPORT]:',
            'toPdf',
            'from',
            'ducks/router',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof ducks_router__WEBPACK_IMPORTED_MODULE_5__['toHome'] !==
              'undefined',
            '[IMPORT]:',
            'toHome',
            'from',
            'ducks/router',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof _LanguageWidget_js__WEBPACK_IMPORTED_MODULE_6__[
              'default'
            ] !== 'undefined',
            '[IMPORT]:',
            'LanguageWidget',
            'from',
            './LanguageWidget.js',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof _SearchWidget_js__WEBPACK_IMPORTED_MODULE_7__['default'] !==
              'undefined',
            '[IMPORT]:',
            'SearchWidget',
            'from',
            './SearchWidget.js',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof components_Icons__WEBPACK_IMPORTED_MODULE_8__['Close'] !==
              'undefined',
            '[IMPORT]:',
            'Close',
            'from',
            'components/Icons',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof components_Icons__WEBPACK_IMPORTED_MODULE_8__['Menu'] !==
              'undefined',
            '[IMPORT]:',
            'Menu',
            'from',
            'components/Icons',
            'is undefined.',
          )
        }, 0)
        var Level = function Level(_ref) {
          var children = _ref.children,
            className = _ref.className
          return React.createElement(
            'div',
            {
              className: classnames__WEBPACK_IMPORTED_MODULE_0___default()(
                'Level',
                className,
              ),
            },
            children,
          )
        }

        var Group = function Group(_ref2) {
          var children = _ref2.children,
            props = _objectWithoutProperties(_ref2, ['children'])

          return React.createElement(
            'div',
            {
              className: classnames__WEBPACK_IMPORTED_MODULE_0___default()(
                'Group',
                props,
              ),
            },
            children,
          )
        }

        var MenuIcon = function MenuIcon(_ref3) {
          var _ref3$expanded = _ref3.expanded,
            expanded = _ref3$expanded === undefined ? false : _ref3$expanded,
            onClick = _ref3.onClick
          return React.createElement(
            'div',
            { className: 'MenuIcon' },
            expanded
              ? React.createElement(
                  components_Icons__WEBPACK_IMPORTED_MODULE_8__['Close'],
                  { onClick: onClick },
                )
              : React.createElement(
                  components_Icons__WEBPACK_IMPORTED_MODULE_8__['Menu'],
                  { onClick: onClick },
                ),
          )
        }

        var PageLinks = function PageLinks(_ref4) {
          var year = _ref4.year
          return React.createElement(
            Group,
            { pageLinks: true },
            React.createElement(
              redux_first_router_link__WEBPACK_IMPORTED_MODULE_1__['NavLink'],
              {
                className: classnames__WEBPACK_IMPORTED_MODULE_0___default()(
                  'MenuItem',
                ),
                to: Object(ducks_router__WEBPACK_IMPORTED_MODULE_5__['toPdf'])(
                  year,
                ),
              },
              'pdf',
            ),
            React.createElement(
              redux_first_router_link__WEBPACK_IMPORTED_MODULE_1__['NavLink'],
              {
                className: classnames__WEBPACK_IMPORTED_MODULE_0___default()(
                  'MenuItem',
                ),
                to: Object(
                  ducks_router__WEBPACK_IMPORTED_MODULE_5__['toPubSchedule'],
                )(year),
              },
              'utgivelsesplan',
            ),
            React.createElement(
              redux_first_router_link__WEBPACK_IMPORTED_MODULE_1__['NavLink'],
              {
                className: classnames__WEBPACK_IMPORTED_MODULE_0___default()(
                  'MenuItem',
                ),
                to: Object(
                  ducks_router__WEBPACK_IMPORTED_MODULE_5__['toAbout'],
                )(),
              },
              'om universitas',
            ),
            React.createElement(
              redux_first_router_link__WEBPACK_IMPORTED_MODULE_1__['NavLink'],
              {
                className: classnames__WEBPACK_IMPORTED_MODULE_0___default()(
                  'MenuItem',
                ),
                to: Object(
                  ducks_router__WEBPACK_IMPORTED_MODULE_5__['toAdInfo'],
                )(),
              },
              'annons\xE9r',
            ),
          )
        }

        var year = new Date().getFullYear()

        var TopMenu = (function(_React$Component) {
          _inherits(TopMenu, _React$Component)

          function TopMenu(props) {
            _classCallCheck(this, TopMenu)

            var _this = _possibleConstructorReturn(
              this,
              _React$Component.call(this, props),
            )

            _this.state = { expanded: false }
            _this.toggleExpand = function() {
              return _this.setState({ expanded: !_this.state.expanded })
            }
            return _this
          }

          TopMenu.prototype.render = function render() {
            var expanded = this.state.expanded

            return React.createElement(
              'section',
              {
                className: classnames__WEBPACK_IMPORTED_MODULE_0___default()(
                  'TopMenu',
                ),
              },
              React.createElement(
                Level,
                null,
                React.createElement(
                  redux_first_router_link__WEBPACK_IMPORTED_MODULE_1___default.a,
                  {
                    to: Object(
                      ducks_router__WEBPACK_IMPORTED_MODULE_5__['toHome'],
                    )(),
                  },
                  React.createElement(
                    components_Logos__WEBPACK_IMPORTED_MODULE_2__[
                      'Universitas'
                    ],
                    {
                      className: classnames__WEBPACK_IMPORTED_MODULE_0___default()(
                        'Logo',
                      ),
                    },
                  ),
                ),
                React.createElement(
                  _Sections_js__WEBPACK_IMPORTED_MODULE_3__['default'],
                  null,
                ),
                React.createElement(PageLinks, this.props),
                React.createElement(
                  _LanguageWidget_js__WEBPACK_IMPORTED_MODULE_6__['default'],
                  null,
                ),
                React.createElement(
                  _SearchWidget_js__WEBPACK_IMPORTED_MODULE_7__['default'],
                  null,
                ),
                React.createElement(MenuIcon, {
                  expanded: expanded,
                  onClick: this.toggleExpand,
                }),
              ),
            )
          }

          // @ts-ignore
          TopMenu.prototype.__reactstandin__regenerateByEval = function __reactstandin__regenerateByEval(
            key,
            code,
          ) {
            // @ts-ignore
            this[key] = eval(code)
          }

          return TopMenu
        })(React.Component)

        var _default = TopMenu

        /* harmony default export */ __webpack_exports__['default'] = _default
        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            Level,
            'Level',
            '/app/src/react/components/TopMenu/Menu.js',
          )
          reactHotLoader.register(
            Group,
            'Group',
            '/app/src/react/components/TopMenu/Menu.js',
          )
          reactHotLoader.register(
            MenuIcon,
            'MenuIcon',
            '/app/src/react/components/TopMenu/Menu.js',
          )
          reactHotLoader.register(
            PageLinks,
            'PageLinks',
            '/app/src/react/components/TopMenu/Menu.js',
          )
          reactHotLoader.register(
            year,
            'year',
            '/app/src/react/components/TopMenu/Menu.js',
          )
          reactHotLoader.register(
            TopMenu,
            'TopMenu',
            '/app/src/react/components/TopMenu/Menu.js',
          )
          reactHotLoader.register(
            _default,
            'default',
            '/app/src/react/components/TopMenu/Menu.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
        __webpack_require__(/*! react */ 'react'),
      ))

      /***/
    },

    /***/ /*!************************************************!*\
  !*** ./src/react/components/TopMenu/Menu.scss ***!
  \************************************************/
    /*! no static exports found */
    /***/ './src/react/components/TopMenu/Menu.scss': function(
      module,
      exports,
    ) {
      // empty (null-loader)
      /***/
    },

    /***/ /*!******************************************************!*\
  !*** ./src/react/components/TopMenu/SearchWidget.js ***!
  \******************************************************/
    /*! exports provided: default */
    /***/ './src/react/components/TopMenu/SearchWidget.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module, React) {
        /* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! react-redux */ 'react-redux',
        )
        /* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
          react_redux__WEBPACK_IMPORTED_MODULE_0__,
        )
        /* harmony import */ var ducks_newsFeed__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! ducks/newsFeed */ './src/react/ducks/newsFeed.js',
        )
        /* harmony import */ var components_Icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          /*! components/Icons */ './src/react/components/Icons.js',
        )
        /* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
          /*! classnames */ 'classnames',
        )
        /* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/ __webpack_require__.n(
          classnames__WEBPACK_IMPORTED_MODULE_3__,
        )
        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        setTimeout(function() {
          console.assert(
            typeof react_redux__WEBPACK_IMPORTED_MODULE_0__['connect'] !==
              'undefined',
            '[IMPORT]:',
            'connect',
            'from',
            'react-redux',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof ducks_newsFeed__WEBPACK_IMPORTED_MODULE_1__['getFeed'] !==
              'undefined',
            '[IMPORT]:',
            'getFeed',
            'from',
            'ducks/newsFeed',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof ducks_newsFeed__WEBPACK_IMPORTED_MODULE_1__[
              'changeSearch'
            ] !== 'undefined',
            '[IMPORT]:',
            'changeSearch',
            'from',
            'ducks/newsFeed',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof components_Icons__WEBPACK_IMPORTED_MODULE_2__['Sync'] !==
              'undefined',
            '[IMPORT]:',
            'Sync',
            'from',
            'components/Icons',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof components_Icons__WEBPACK_IMPORTED_MODULE_2__['Search'] !==
              'undefined',
            '[IMPORT]:',
            'Search',
            'from',
            'components/Icons',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof classnames__WEBPACK_IMPORTED_MODULE_3___default.a !==
              'undefined',
            '[IMPORT]:',
            'cx',
            'from',
            'classnames',
            'is undefined.',
          )
        }, 0)
        var Icon = function Icon(_ref) {
          var fetching = _ref.fetching
          return React.createElement(
            'div',
            {
              className: classnames__WEBPACK_IMPORTED_MODULE_3___default()(
                'Icon',
                { fetching: fetching },
              ),
            },
            fetching
              ? React.createElement(
                  components_Icons__WEBPACK_IMPORTED_MODULE_2__['Sync'],
                  null,
                )
              : React.createElement(
                  components_Icons__WEBPACK_IMPORTED_MODULE_2__['Search'],
                  null,
                ),
          )
        }

        var SearchWidget = function SearchWidget(_ref2) {
          var _ref2$search = _ref2.search,
            search = _ref2$search === undefined ? '' : _ref2$search,
            changeSearch = _ref2.changeSearch,
            fetching = _ref2.fetching
          return React.createElement(
            'div',
            {
              className: classnames__WEBPACK_IMPORTED_MODULE_3___default()(
                'SearchWidget',
              ),
            },
            React.createElement(Icon, { fetching: fetching }),
            React.createElement('input', {
              onChange: function onChange(e) {
                return changeSearch(e.target.value)
              },
              type: 'text',
              placeholder: 's\xF8k...',
              value: search,
            }),
          )
        }

        var mapStateToProps =
          ducks_newsFeed__WEBPACK_IMPORTED_MODULE_1__['getFeed']
        var mapDispatchToProps = {
          changeSearch:
            ducks_newsFeed__WEBPACK_IMPORTED_MODULE_1__['changeSearch'],
        }

        var _default = Object(
          react_redux__WEBPACK_IMPORTED_MODULE_0__['connect'],
        )(mapStateToProps, mapDispatchToProps)(SearchWidget)

        /* harmony default export */ __webpack_exports__['default'] = _default
        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            Icon,
            'Icon',
            '/app/src/react/components/TopMenu/SearchWidget.js',
          )
          reactHotLoader.register(
            SearchWidget,
            'SearchWidget',
            '/app/src/react/components/TopMenu/SearchWidget.js',
          )
          reactHotLoader.register(
            mapStateToProps,
            'mapStateToProps',
            '/app/src/react/components/TopMenu/SearchWidget.js',
          )
          reactHotLoader.register(
            mapDispatchToProps,
            'mapDispatchToProps',
            '/app/src/react/components/TopMenu/SearchWidget.js',
          )
          reactHotLoader.register(
            _default,
            'default',
            '/app/src/react/components/TopMenu/SearchWidget.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
        __webpack_require__(/*! react */ 'react'),
      ))

      /***/
    },

    /***/ /*!**************************************************!*\
  !*** ./src/react/components/TopMenu/Sections.js ***!
  \**************************************************/
    /*! exports provided: default */
    /***/ './src/react/components/TopMenu/Sections.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module, React) {
        /* harmony import */ var redux_first_router_link__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! redux-first-router-link */ 'redux-first-router-link',
        )
        /* harmony import */ var redux_first_router_link__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
          redux_first_router_link__WEBPACK_IMPORTED_MODULE_0__,
        )
        /* harmony import */ var ducks_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! ducks/router */ './src/react/ducks/router.js',
        )
        /* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          /*! classnames */ 'classnames',
        )
        /* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/ __webpack_require__.n(
          classnames__WEBPACK_IMPORTED_MODULE_2__,
        )
        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        setTimeout(function() {
          console.assert(
            typeof redux_first_router_link__WEBPACK_IMPORTED_MODULE_0__[
              'NavLink'
            ] !== 'undefined',
            '[IMPORT]:',
            'NavLink',
            'from',
            'redux-first-router-link',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof ducks_router__WEBPACK_IMPORTED_MODULE_1__['toSection'] !==
              'undefined',
            '[IMPORT]:',
            'toSection',
            'from',
            'ducks/router',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof classnames__WEBPACK_IMPORTED_MODULE_2___default.a !==
              'undefined',
            '[IMPORT]:',
            'cx',
            'from',
            'classnames',
            'is undefined.',
          )
        }, 0)
        var Sections = function Sections(_ref) {
          var _ref$sections = _ref.sections,
            sections =
              _ref$sections === undefined
                ? ['nyhet', 'kultur', 'magasin', 'debatt']
                : _ref$sections
          return React.createElement(
            'nav',
            { className: 'Sections' },
            sections.map(function(title) {
              return React.createElement(
                redux_first_router_link__WEBPACK_IMPORTED_MODULE_0__['NavLink'],
                {
                  key: title,
                  className: classnames__WEBPACK_IMPORTED_MODULE_2___default()(
                    'MenuItem',
                  ),
                  to: Object(
                    ducks_router__WEBPACK_IMPORTED_MODULE_1__['toSection'],
                  )(title),
                  children: title,
                },
              )
            }),
          )
        }
        var _default = Sections
        /* harmony default export */ __webpack_exports__['default'] = _default
        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            Sections,
            'Sections',
            '/app/src/react/components/TopMenu/Sections.js',
          )
          reactHotLoader.register(
            _default,
            'default',
            '/app/src/react/components/TopMenu/Sections.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
        __webpack_require__(/*! react */ 'react'),
      ))

      /***/
    },

    /***/ /*!***********************************************!*\
  !*** ./src/react/components/TopMenu/index.js ***!
  \***********************************************/
    /*! exports provided: default */
    /***/ './src/react/components/TopMenu/index.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module) {
        /* harmony import */ var styles_universitas_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! styles/universitas.scss */ './src/react/styles/universitas.scss',
        )
        /* harmony import */ var styles_universitas_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
          styles_universitas_scss__WEBPACK_IMPORTED_MODULE_0__,
        )
        /* harmony import */ var _Menu_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! ./Menu.scss */ './src/react/components/TopMenu/Menu.scss',
        )
        /* harmony import */ var _Menu_scss__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(
          _Menu_scss__WEBPACK_IMPORTED_MODULE_1__,
        )
        /* harmony import */ var _Menu__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          /*! ./Menu */ './src/react/components/TopMenu/Menu.js',
        )
        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        setTimeout(function() {
          console.assert(
            typeof _Menu__WEBPACK_IMPORTED_MODULE_2__['default'] !==
              'undefined',
            '[IMPORT]:',
            'Menu',
            'from',
            './Menu',
            'is undefined.',
          )
        }, 0)
        var _default = _Menu__WEBPACK_IMPORTED_MODULE_2__['default']
        /* harmony default export */ __webpack_exports__['default'] = _default
        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            _default,
            'default',
            '/app/src/react/components/TopMenu/index.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
      ))

      /***/
    },

    /***/ /*!***********************************!*\
  !*** ./src/react/ducks/issues.js ***!
  \***********************************/
    /*! exports provided: getIssues, ISSUES_REQUESTED, issuesRequested, ISSUES_FETCHED, issuesFetched, default */
    /***/ './src/react/ducks/issues.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module, R) {
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'getIssues',
          function() {
            return getIssues
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'ISSUES_REQUESTED',
          function() {
            return ISSUES_REQUESTED
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'issuesRequested',
          function() {
            return issuesRequested
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'ISSUES_FETCHED',
          function() {
            return ISSUES_FETCHED
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'issuesFetched',
          function() {
            return issuesFetched
          },
        )
        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        var sliceLens = R.lensProp('issues')

        // Selectors
        var getIssues = R.view(sliceLens)

        // Actions
        var ISSUES_REQUESTED = 'issues/ISSUES_REQUESTED'
        var issuesRequested = function issuesRequested() {
          return { type: ISSUES_REQUESTED, payload: {} }
        }

        var ISSUES_FETCHED = 'issues/ISSUES_FETCHED'
        var issuesFetched = function issuesFetched(_ref) {
          var results = _ref.results
          return {
            type: ISSUES_FETCHED,
            payload: { issues: results },
          }
        }

        // Reducer
        var initialState = { fetching: false }
        var getReducer = function getReducer(_ref2) {
          var type = _ref2.type,
            payload = _ref2.payload,
            error = _ref2.error

          switch (type) {
            case ISSUES_REQUESTED:
              return R.assoc('fetching', true)
            case ISSUES_FETCHED:
              return R.compose(R.assoc('fetching', false), R.merge(payload))
            default:
              return R.identity
          }
        }

        var _default = function _default() {
          var state =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : initialState
          var action = arguments[1]
          return getReducer(action)(state)
        }

        /* harmony default export */ __webpack_exports__['default'] = _default
        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            sliceLens,
            'sliceLens',
            '/app/src/react/ducks/issues.js',
          )
          reactHotLoader.register(
            getIssues,
            'getIssues',
            '/app/src/react/ducks/issues.js',
          )
          reactHotLoader.register(
            ISSUES_REQUESTED,
            'ISSUES_REQUESTED',
            '/app/src/react/ducks/issues.js',
          )
          reactHotLoader.register(
            issuesRequested,
            'issuesRequested',
            '/app/src/react/ducks/issues.js',
          )
          reactHotLoader.register(
            ISSUES_FETCHED,
            'ISSUES_FETCHED',
            '/app/src/react/ducks/issues.js',
          )
          reactHotLoader.register(
            issuesFetched,
            'issuesFetched',
            '/app/src/react/ducks/issues.js',
          )
          reactHotLoader.register(
            initialState,
            'initialState',
            '/app/src/react/ducks/issues.js',
          )
          reactHotLoader.register(
            getReducer,
            'getReducer',
            '/app/src/react/ducks/issues.js',
          )
          reactHotLoader.register(
            _default,
            'default',
            '/app/src/react/ducks/issues.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
        __webpack_require__(/*! ramda */ 'ramda'),
      ))

      /***/
    },

    /***/ /*!*************************************!*\
  !*** ./src/react/ducks/newsFeed.js ***!
  \*************************************/
    /*! exports provided: getFeed, getItems, getSearch, getSearchResults, getFetching, getLanguage, getFeedQuery, FEED_REQUESTED, feedRequested, FEED_FETCHED, feedFetched, SEARCH_FETCHED, searchFetched, TOGGLE_LANGUAGE, toggleLanguage, SEARCH, changeSearch, default */
    /***/ './src/react/ducks/newsFeed.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module, R) {
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'getFeed',
          function() {
            return getFeed
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'getItems',
          function() {
            return getItems
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'getSearch',
          function() {
            return getSearch
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'getSearchResults',
          function() {
            return getSearchResults
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'getFetching',
          function() {
            return getFetching
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'getLanguage',
          function() {
            return getLanguage
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'getFeedQuery',
          function() {
            return getFeedQuery
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'FEED_REQUESTED',
          function() {
            return FEED_REQUESTED
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'feedRequested',
          function() {
            return feedRequested
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'FEED_FETCHED',
          function() {
            return FEED_FETCHED
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'feedFetched',
          function() {
            return feedFetched
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'SEARCH_FETCHED',
          function() {
            return SEARCH_FETCHED
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'searchFetched',
          function() {
            return searchFetched
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'TOGGLE_LANGUAGE',
          function() {
            return TOGGLE_LANGUAGE
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'toggleLanguage',
          function() {
            return toggleLanguage
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'SEARCH',
          function() {
            return SEARCH
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'changeSearch',
          function() {
            return changeSearch
          },
        )
        /* harmony import */ var ducks_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! ducks/router */ './src/react/ducks/router.js',
        )
        var _extends =
          Object.assign ||
          function(target) {
            for (var i = 1; i < arguments.length; i++) {
              var source = arguments[i]
              for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                  target[key] = source[key]
                }
              }
            }
            return target
          }

        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        // Lenses
        setTimeout(function() {
          console.assert(
            typeof ducks_router__WEBPACK_IMPORTED_MODULE_0__['STORY'] !==
              'undefined',
            '[IMPORT]:',
            'STORY',
            'from',
            'ducks/router',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof ducks_router__WEBPACK_IMPORTED_MODULE_0__['SECTION'] !==
              'undefined',
            '[IMPORT]:',
            'SECTION',
            'from',
            'ducks/router',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof ducks_router__WEBPACK_IMPORTED_MODULE_0__['HOME'] !==
              'undefined',
            '[IMPORT]:',
            'HOME',
            'from',
            'ducks/router',
            'is undefined.',
          )
        }, 0)
        var lens = R.pipe(R.split('.'), R.lensPath)
        var sliceLens = lens('newsFeed')
        var selectorFromLens = function selectorFromLens(l) {
          return R.view(R.compose(sliceLens, l))
        }

        var feedLens = lens('results')
        var searchLens = lens('search')
        var fetchingLens = lens('fetching')
        var languageLens = lens('language')
        var searchResultsLens = lens('searchResults')

        // Selectors
        var getFeed = R.view(sliceLens)

        var getSections = function getSections(title) {
          return (
            {
              kultur: [3, 8],
              debatt: [4, 7],
              magasin: [2],
              nyhet: [1],
            }[title] || null
          )
        }

        var filterFeed = function filterFeed(_ref) {
          var _ref$results = _ref.results,
            results = _ref$results === undefined ? [] : _ref$results,
            language = _ref.language,
            section = _ref.section

          var sections = getSections(section)
          var isSection = sections
            ? R.filter(R.propSatisfies(R.flip(R.contains)(sections), 'section'))
            : R.identity

          var isLanguage = language
            ? R.filter(R.propEq('language', language))
            : R.identity

          return R.into([], R.compose(isSection, isLanguage), results)
        }

        var getItems = R.pipe(getFeed, filterFeed)
        var getSearch = selectorFromLens(searchLens)
        var getSearchResults = selectorFromLens(searchResultsLens)
        var getFetching = selectorFromLens(fetchingLens)
        var getLanguage = selectorFromLens(languageLens)
        var getFeedQuery = R.pipe(
          getFeed,
          R.pick(['search', 'language', 'section']),
          R.evolve({ section: getSections }),
        )

        // Actions
        var FEED_REQUESTED = 'newsfeed/FEED_REQUESTED'
        var feedRequested = function feedRequested() {
          var params =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : {}
          return {
            type: FEED_REQUESTED,
            payload: params,
          }
        }
        var FEED_FETCHED = 'newsfeed/FEED_FETCHED'
        var feedFetched = function feedFetched(data) {
          return {
            type: FEED_FETCHED,
            payload: data,
          }
        }
        var SEARCH_FETCHED = 'newsfeed/SEARCH_FETCHED'
        var searchFetched = function searchFetched(data) {
          return {
            type: SEARCH_FETCHED,
            payload: data,
          }
        }
        var TOGGLE_LANGUAGE = 'newsfeed/TOGGLE_LANGUAGE'
        var toggleLanguage = function toggleLanguage(language) {
          return {
            type: TOGGLE_LANGUAGE,
            payload: { language: language },
          }
        }
        var SEARCH = 'newsfeed/SEARCH'
        var changeSearch = function changeSearch(search) {
          return {
            type: SEARCH,
            payload: { search: search },
          }
        }

        // reducers
        var initialState = {
          fetching: false,
          results: [],
          searchResults: [],
          section: null,
          search: '',
          language: 'nor',
        }

        var mergeFeed = function mergeFeed(fetched) {
          return function() {
            var state =
              arguments.length > 0 && arguments[0] !== undefined
                ? arguments[0]
                : []
            return R.pipe(
              function(state) {
                return R.concat(state, fetched)
              },
              R.indexBy(R.prop('id')),
              R.values,
              R.sortBy(R.prop('order')),
              R.reverse,
            )(state)
          }
        }

        var mergeLeft = R.flip(R.merge)

        var getReducer = function getReducer(_ref2) {
          var type = _ref2.type,
            payload = _ref2.payload,
            error = _ref2.error

          switch (type) {
            case ducks_router__WEBPACK_IMPORTED_MODULE_0__['STORY']:
              return R.assoc('search', '')
            case ducks_router__WEBPACK_IMPORTED_MODULE_0__['HOME']:
              return mergeLeft({
                section: null,
                next: true,
                search: '',
                searchResults: [],
              })
            case ducks_router__WEBPACK_IMPORTED_MODULE_0__['SECTION']:
              return mergeLeft(_extends({}, payload, { next: true }))
            case FEED_REQUESTED:
              return R.assoc('fetching', true)
            case FEED_FETCHED: {
              var results = payload.results,
                next = payload.next

              return R.compose(
                mergeLeft({ fetching: false, next: next }),
                R.over(feedLens, mergeFeed(results)),
              )
            }
            case SEARCH:
              return mergeLeft(
                _extends({}, payload, { fetching: true, next: true }),
              )
            case SEARCH_FETCHED: {
              var _results = payload.results,
                _next = payload.next

              return R.compose(
                mergeLeft({ fetching: false, next: _next }),
                R.set(searchResultsLens, _results),
              )
            }
            case TOGGLE_LANGUAGE:
              return R.compose(
                R.over(languageLens, function(l) {
                  return l == payload.language ? null : payload.language
                }),
                R.assoc('next', true),
              )
            default:
              return R.identity
          }
        }

        var _default = function _default() {
          var state =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : initialState
          var action = arguments[1]
          return getReducer(action)(state)
        }

        /* harmony default export */ __webpack_exports__['default'] = _default
        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            lens,
            'lens',
            '/app/src/react/ducks/newsFeed.js',
          )
          reactHotLoader.register(
            sliceLens,
            'sliceLens',
            '/app/src/react/ducks/newsFeed.js',
          )
          reactHotLoader.register(
            selectorFromLens,
            'selectorFromLens',
            '/app/src/react/ducks/newsFeed.js',
          )
          reactHotLoader.register(
            feedLens,
            'feedLens',
            '/app/src/react/ducks/newsFeed.js',
          )
          reactHotLoader.register(
            searchLens,
            'searchLens',
            '/app/src/react/ducks/newsFeed.js',
          )
          reactHotLoader.register(
            fetchingLens,
            'fetchingLens',
            '/app/src/react/ducks/newsFeed.js',
          )
          reactHotLoader.register(
            languageLens,
            'languageLens',
            '/app/src/react/ducks/newsFeed.js',
          )
          reactHotLoader.register(
            searchResultsLens,
            'searchResultsLens',
            '/app/src/react/ducks/newsFeed.js',
          )
          reactHotLoader.register(
            getFeed,
            'getFeed',
            '/app/src/react/ducks/newsFeed.js',
          )
          reactHotLoader.register(
            getSections,
            'getSections',
            '/app/src/react/ducks/newsFeed.js',
          )
          reactHotLoader.register(
            filterFeed,
            'filterFeed',
            '/app/src/react/ducks/newsFeed.js',
          )
          reactHotLoader.register(
            getItems,
            'getItems',
            '/app/src/react/ducks/newsFeed.js',
          )
          reactHotLoader.register(
            getSearch,
            'getSearch',
            '/app/src/react/ducks/newsFeed.js',
          )
          reactHotLoader.register(
            getSearchResults,
            'getSearchResults',
            '/app/src/react/ducks/newsFeed.js',
          )
          reactHotLoader.register(
            getFetching,
            'getFetching',
            '/app/src/react/ducks/newsFeed.js',
          )
          reactHotLoader.register(
            getLanguage,
            'getLanguage',
            '/app/src/react/ducks/newsFeed.js',
          )
          reactHotLoader.register(
            getFeedQuery,
            'getFeedQuery',
            '/app/src/react/ducks/newsFeed.js',
          )
          reactHotLoader.register(
            FEED_REQUESTED,
            'FEED_REQUESTED',
            '/app/src/react/ducks/newsFeed.js',
          )
          reactHotLoader.register(
            feedRequested,
            'feedRequested',
            '/app/src/react/ducks/newsFeed.js',
          )
          reactHotLoader.register(
            FEED_FETCHED,
            'FEED_FETCHED',
            '/app/src/react/ducks/newsFeed.js',
          )
          reactHotLoader.register(
            feedFetched,
            'feedFetched',
            '/app/src/react/ducks/newsFeed.js',
          )
          reactHotLoader.register(
            SEARCH_FETCHED,
            'SEARCH_FETCHED',
            '/app/src/react/ducks/newsFeed.js',
          )
          reactHotLoader.register(
            searchFetched,
            'searchFetched',
            '/app/src/react/ducks/newsFeed.js',
          )
          reactHotLoader.register(
            TOGGLE_LANGUAGE,
            'TOGGLE_LANGUAGE',
            '/app/src/react/ducks/newsFeed.js',
          )
          reactHotLoader.register(
            toggleLanguage,
            'toggleLanguage',
            '/app/src/react/ducks/newsFeed.js',
          )
          reactHotLoader.register(
            SEARCH,
            'SEARCH',
            '/app/src/react/ducks/newsFeed.js',
          )
          reactHotLoader.register(
            changeSearch,
            'changeSearch',
            '/app/src/react/ducks/newsFeed.js',
          )
          reactHotLoader.register(
            initialState,
            'initialState',
            '/app/src/react/ducks/newsFeed.js',
          )
          reactHotLoader.register(
            mergeFeed,
            'mergeFeed',
            '/app/src/react/ducks/newsFeed.js',
          )
          reactHotLoader.register(
            mergeLeft,
            'mergeLeft',
            '/app/src/react/ducks/newsFeed.js',
          )
          reactHotLoader.register(
            getReducer,
            'getReducer',
            '/app/src/react/ducks/newsFeed.js',
          )
          reactHotLoader.register(
            _default,
            'default',
            '/app/src/react/ducks/newsFeed.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
        __webpack_require__(/*! ramda */ 'ramda'),
      ))

      /***/
    },

    /***/ /*!****************************************!*\
  !*** ./src/react/ducks/publicstory.js ***!
  \****************************************/
    /*! exports provided: getStory, STORY_REQUESTED, storyRequested, STORY_FETCHED, storyFetched, default */
    /***/ './src/react/ducks/publicstory.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module, R) {
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'getStory',
          function() {
            return getStory
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'STORY_REQUESTED',
          function() {
            return STORY_REQUESTED
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'storyRequested',
          function() {
            return storyRequested
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'STORY_FETCHED',
          function() {
            return STORY_FETCHED
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'storyFetched',
          function() {
            return storyFetched
          },
        )
        /* harmony import */ var markup_nodeTree__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! markup/nodeTree */ './src/react/markup/nodeTree.js',
        )
        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        var SLICE = 'publicstory'

        // Lenses
        setTimeout(function() {
          console.assert(
            typeof markup_nodeTree__WEBPACK_IMPORTED_MODULE_0__[
              'buildNodeTree'
            ] !== 'undefined',
            '[IMPORT]:',
            'buildNodeTree',
            'from',
            'markup/nodeTree',
            'is undefined.',
          )
        }, 0)
        var sliceLens = R.lensProp(SLICE)
        var storyLens = R.lensProp

        // Selectors
        var selectorFromLens = function selectorFromLens(l) {
          return R.view(R.compose(sliceLens, l))
        }
        var getStory = function getStory(id) {
          return function(state) {
            var story = selectorFromLens(storyLens(id))(state)
            if (story && story.id) {
              var obj = Object(
                markup_nodeTree__WEBPACK_IMPORTED_MODULE_0__['buildNodeTree'],
              )(story)
              return obj
            }
            return story
          }
        }

        // Actions
        var STORY_REQUESTED = 'publicstory/STORY_REQUESTED'
        var storyRequested = function storyRequested(id) {
          var prefetch =
            arguments.length > 1 && arguments[1] !== undefined
              ? arguments[1]
              : false
          return {
            type: STORY_REQUESTED,
            payload: { id: id, prefetch: prefetch },
          }
        }
        var STORY_FETCHED = 'publicstory/STORY_FETCHED'
        var storyFetched = function storyFetched(data) {
          return {
            type: STORY_FETCHED,
            payload: data,
          }
        }

        var mergeLeft = R.flip(R.merge)

        var getReducer = function getReducer(_ref) {
          var type = _ref.type,
            payload = _ref.payload,
            error = _ref.error

          switch (type) {
            case STORY_REQUESTED:
              return R.over(
                storyLens(payload.id),
                mergeLeft({ fetching: true }),
              )
            case STORY_FETCHED:
              return R.over(
                storyLens(payload.id),
                R.pipe(mergeLeft(payload), R.assoc('fetching', false)),
              )
            default:
              return R.identity
          }
        }

        var _default = function _default() {
          var state =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : {}
          var action = arguments[1]
          return getReducer(action)(state)
        }

        /* harmony default export */ __webpack_exports__['default'] = _default
        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            SLICE,
            'SLICE',
            '/app/src/react/ducks/publicstory.js',
          )
          reactHotLoader.register(
            sliceLens,
            'sliceLens',
            '/app/src/react/ducks/publicstory.js',
          )
          reactHotLoader.register(
            storyLens,
            'storyLens',
            '/app/src/react/ducks/publicstory.js',
          )
          reactHotLoader.register(
            selectorFromLens,
            'selectorFromLens',
            '/app/src/react/ducks/publicstory.js',
          )
          reactHotLoader.register(
            getStory,
            'getStory',
            '/app/src/react/ducks/publicstory.js',
          )
          reactHotLoader.register(
            STORY_REQUESTED,
            'STORY_REQUESTED',
            '/app/src/react/ducks/publicstory.js',
          )
          reactHotLoader.register(
            storyRequested,
            'storyRequested',
            '/app/src/react/ducks/publicstory.js',
          )
          reactHotLoader.register(
            STORY_FETCHED,
            'STORY_FETCHED',
            '/app/src/react/ducks/publicstory.js',
          )
          reactHotLoader.register(
            storyFetched,
            'storyFetched',
            '/app/src/react/ducks/publicstory.js',
          )
          reactHotLoader.register(
            mergeLeft,
            'mergeLeft',
            '/app/src/react/ducks/publicstory.js',
          )
          reactHotLoader.register(
            getReducer,
            'getReducer',
            '/app/src/react/ducks/publicstory.js',
          )
          reactHotLoader.register(
            _default,
            'default',
            '/app/src/react/ducks/publicstory.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
        __webpack_require__(/*! ramda */ 'ramda'),
      ))

      /***/
    },

    /***/ /*!***********************************!*\
  !*** ./src/react/ducks/router.js ***!
  \***********************************/
    /*! exports provided: HOME, SECTION, PDF, ABOUT, AD_INFO, STORY, SCHEDULE, SHORT_URL, NOT_FOUND, toHome, toSection, toPdf, toPubSchedule, toAbout, toAdInfo, toStory, toShortUrl, routesMap, routerOptions, reverse, reverseFull, getLocation */
    /***/ './src/react/ducks/router.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module, R) {
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'HOME',
          function() {
            return HOME
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'SECTION',
          function() {
            return SECTION
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'PDF',
          function() {
            return PDF
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'ABOUT',
          function() {
            return ABOUT
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'AD_INFO',
          function() {
            return AD_INFO
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'STORY',
          function() {
            return STORY
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'SCHEDULE',
          function() {
            return SCHEDULE
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'SHORT_URL',
          function() {
            return SHORT_URL
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'toHome',
          function() {
            return toHome
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'toSection',
          function() {
            return toSection
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'toPdf',
          function() {
            return toPdf
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'toPubSchedule',
          function() {
            return toPubSchedule
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'toAbout',
          function() {
            return toAbout
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'toAdInfo',
          function() {
            return toAdInfo
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'toStory',
          function() {
            return toStory
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'toShortUrl',
          function() {
            return toShortUrl
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'routesMap',
          function() {
            return routesMap
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'routerOptions',
          function() {
            return routerOptions
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'reverse',
          function() {
            return reverse
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'reverseFull',
          function() {
            return reverseFull
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'getLocation',
          function() {
            return getLocation
          },
        )
        /* harmony import */ var redux_first_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! redux-first-router */ 'redux-first-router',
        )
        /* harmony import */ var redux_first_router__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
          redux_first_router__WEBPACK_IMPORTED_MODULE_0__,
        )
        /* harmony reexport (safe) */ __webpack_require__.d(
          __webpack_exports__,
          'NOT_FOUND',
          function() {
            return redux_first_router__WEBPACK_IMPORTED_MODULE_0__['NOT_FOUND']
          },
        )

        /* harmony import */ var utils_text__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! utils/text */ './src/react/utils/text.js',
        )
        /* harmony import */ var utils_urls__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          /*! utils/urls */ './src/react/utils/urls.js',
        )
        var _routesMap

        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        // ducks for redux-first-router of frontpage apps

        setTimeout(function() {
          console.assert(
            typeof redux_first_router__WEBPACK_IMPORTED_MODULE_0__[
              'actionToPath'
            ] !== 'undefined',
            '[IMPORT]:',
            'actionToPath',
            'from',
            'redux-first-router',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof redux_first_router__WEBPACK_IMPORTED_MODULE_0__[
              'NOT_FOUND'
            ] !== 'undefined',
            '[IMPORT]:',
            'NOT_FOUND',
            'from',
            'redux-first-router',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof utils_text__WEBPACK_IMPORTED_MODULE_1__['slugify'] !==
              'undefined',
            '[IMPORT]:',
            'slugify',
            'from',
            'utils/text',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof utils_urls__WEBPACK_IMPORTED_MODULE_2__['absoluteURL'] !==
              'undefined',
            '[IMPORT]:',
            'absoluteURL',
            'from',
            'utils/urls',
            'is undefined.',
          )
        }, 0)
        var SLICE = 'location'

        var HOME = 'router/HOME'
        var SECTION = 'router/SECTION'
        var PDF = 'router/PDF'
        var ABOUT = 'router/ABOUT'
        var AD_INFO = 'router/AD_INFO'
        var STORY = 'router/STORY'
        var SCHEDULE = 'router/SCHEDULE'
        var SHORT_URL = 'router/SHORT_URL'

        // Action creators
        var toHome = function toHome() {
          return { type: HOME, payload: { section: null } }
        }
        var toSection = function toSection(section) {
          return { type: SECTION, payload: { section: section } }
        }
        var toPdf = function toPdf(year) {
          return { type: PDF, payload: { year: year } }
        }
        var toPubSchedule = function toPubSchedule(year) {
          return { type: SCHEDULE, payload: { year: year } }
        }
        var toAbout = function toAbout() {
          return { type: ABOUT, payload: {} }
        }
        var toAdInfo = function toAdInfo() {
          return { type: AD_INFO, payload: {} }
        }
        var toStory = function toStory(_ref) {
          var id = _ref.id,
            _ref$title = _ref.title,
            title = _ref$title === undefined ? '' : _ref$title,
            section = _ref.section,
            _ref$story_type = _ref.story_type,
            story_type = _ref$story_type === undefined ? {} : _ref$story_type
          return {
            type: STORY,
            payload: {
              id: id,
              slug: Object(utils_text__WEBPACK_IMPORTED_MODULE_1__['slugify'])(
                title,
              ).substr(0, 50),
              section:
                Object(utils_text__WEBPACK_IMPORTED_MODULE_1__['slugify'])(
                  section || story_type.section || 'sak',
                ) || null,
            },
          }
        }
        var toShortUrl = function toShortUrl(_ref2) {
          var id = _ref2.id
          return { type: SHORT_URL, payload: { id: id } }
        }

        // url routes action mappings

        var routesMap = ((_routesMap = {}),
        (_routesMap[HOME] = '/'),
        (_routesMap[PDF] = '/pdf/:year?/'),
        (_routesMap[SCHEDULE] = '/utgivelsesplan/:year?/'),
        (_routesMap[STORY] = '/:section/:id(\\d+)/:slug?'),
        (_routesMap[SHORT_URL] = '/:section?/:id(\\d+)/:slug?/'),
        (_routesMap[ABOUT] = '/om-universitas/'),
        (_routesMap[AD_INFO] = '/annonser/'),
        (_routesMap[SECTION] = '/:section/forside/'),
        (_routesMap[
          redux_first_router__WEBPACK_IMPORTED_MODULE_0__['NOT_FOUND']
        ] =
          '/not-found/'),
        _routesMap)

        var routerOptions = {
          // scrollTop: true,
          basename: '/dev',
        }

        var reverse = function reverse(action) {
          return Object(
            redux_first_router__WEBPACK_IMPORTED_MODULE_0__['actionToPath'],
          )(action, routesMap)
        }
        var reverseFull = R.pipe(
          reverse,
          R.concat(routerOptions.basename || ''),
          utils_urls__WEBPACK_IMPORTED_MODULE_2__['absoluteURL'],
        )

        var getLocation = R.prop(SLICE)
        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            SLICE,
            'SLICE',
            '/app/src/react/ducks/router.js',
          )
          reactHotLoader.register(
            HOME,
            'HOME',
            '/app/src/react/ducks/router.js',
          )
          reactHotLoader.register(
            SECTION,
            'SECTION',
            '/app/src/react/ducks/router.js',
          )
          reactHotLoader.register(PDF, 'PDF', '/app/src/react/ducks/router.js')
          reactHotLoader.register(
            ABOUT,
            'ABOUT',
            '/app/src/react/ducks/router.js',
          )
          reactHotLoader.register(
            AD_INFO,
            'AD_INFO',
            '/app/src/react/ducks/router.js',
          )
          reactHotLoader.register(
            STORY,
            'STORY',
            '/app/src/react/ducks/router.js',
          )
          reactHotLoader.register(
            SCHEDULE,
            'SCHEDULE',
            '/app/src/react/ducks/router.js',
          )
          reactHotLoader.register(
            SHORT_URL,
            'SHORT_URL',
            '/app/src/react/ducks/router.js',
          )
          reactHotLoader.register(
            toHome,
            'toHome',
            '/app/src/react/ducks/router.js',
          )
          reactHotLoader.register(
            toSection,
            'toSection',
            '/app/src/react/ducks/router.js',
          )
          reactHotLoader.register(
            toPdf,
            'toPdf',
            '/app/src/react/ducks/router.js',
          )
          reactHotLoader.register(
            toPubSchedule,
            'toPubSchedule',
            '/app/src/react/ducks/router.js',
          )
          reactHotLoader.register(
            toAbout,
            'toAbout',
            '/app/src/react/ducks/router.js',
          )
          reactHotLoader.register(
            toAdInfo,
            'toAdInfo',
            '/app/src/react/ducks/router.js',
          )
          reactHotLoader.register(
            toStory,
            'toStory',
            '/app/src/react/ducks/router.js',
          )
          reactHotLoader.register(
            toShortUrl,
            'toShortUrl',
            '/app/src/react/ducks/router.js',
          )
          reactHotLoader.register(
            routesMap,
            'routesMap',
            '/app/src/react/ducks/router.js',
          )
          reactHotLoader.register(
            routerOptions,
            'routerOptions',
            '/app/src/react/ducks/router.js',
          )
          reactHotLoader.register(
            reverse,
            'reverse',
            '/app/src/react/ducks/router.js',
          )
          reactHotLoader.register(
            reverseFull,
            'reverseFull',
            '/app/src/react/ducks/router.js',
          )
          reactHotLoader.register(
            getLocation,
            'getLocation',
            '/app/src/react/ducks/router.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
        __webpack_require__(/*! ramda */ 'ramda'),
      ))

      /***/
    },

    /***/ /*!*********************************!*\
  !*** ./src/react/ducks/site.js ***!
  \*********************************/
    /*! exports provided: getSite, getSections, SITE_REQUESTED, siteRequested, SITE_FETCHED, siteFetched, default */
    /***/ './src/react/ducks/site.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module, R) {
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'getSite',
          function() {
            return getSite
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'getSections',
          function() {
            return getSections
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'SITE_REQUESTED',
          function() {
            return SITE_REQUESTED
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'siteRequested',
          function() {
            return siteRequested
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'SITE_FETCHED',
          function() {
            return SITE_FETCHED
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'siteFetched',
          function() {
            return siteFetched
          },
        )
        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        // Lenses
        var sliceLens = R.lensProp('site')

        // Selectors
        var getSite = R.view(sliceLens)
        var getSections = R.view(R.compose(sliceLens, R.lensProp('sections')))

        // Actions
        var SITE_REQUESTED = 'site/SITE_REQUESTED'
        var siteRequested = function siteRequested() {
          return { type: SITE_REQUESTED, payload: {} }
        }

        var SITE_FETCHED = 'site/SITE_FETCHED'
        var siteFetched = function siteFetched(data) {
          return { type: SITE_FETCHED, payload: data }
        }

        // reducers
        var initialState = { fetching: false }

        var getReducer = function getReducer(_ref) {
          var type = _ref.type,
            payload = _ref.payload,
            error = _ref.error

          switch (type) {
            case SITE_REQUESTED:
              return R.assoc('fetching', true)
            case SITE_FETCHED:
              return R.compose(R.assoc('fetching', false), R.merge(payload))
            default:
              return R.identity
          }
        }

        var _default = function _default() {
          var state =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : initialState
          var action = arguments[1]
          return getReducer(action)(state)
        }

        /* harmony default export */ __webpack_exports__['default'] = _default
        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            sliceLens,
            'sliceLens',
            '/app/src/react/ducks/site.js',
          )
          reactHotLoader.register(
            getSite,
            'getSite',
            '/app/src/react/ducks/site.js',
          )
          reactHotLoader.register(
            getSections,
            'getSections',
            '/app/src/react/ducks/site.js',
          )
          reactHotLoader.register(
            SITE_REQUESTED,
            'SITE_REQUESTED',
            '/app/src/react/ducks/site.js',
          )
          reactHotLoader.register(
            siteRequested,
            'siteRequested',
            '/app/src/react/ducks/site.js',
          )
          reactHotLoader.register(
            SITE_FETCHED,
            'SITE_FETCHED',
            '/app/src/react/ducks/site.js',
          )
          reactHotLoader.register(
            siteFetched,
            'siteFetched',
            '/app/src/react/ducks/site.js',
          )
          reactHotLoader.register(
            initialState,
            'initialState',
            '/app/src/react/ducks/site.js',
          )
          reactHotLoader.register(
            getReducer,
            'getReducer',
            '/app/src/react/ducks/site.js',
          )
          reactHotLoader.register(
            _default,
            'default',
            '/app/src/react/ducks/site.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
        __webpack_require__(/*! ramda */ 'ramda'),
      ))

      /***/
    },

    /***/ /*!***********************************!*\
  !*** ./src/react/markup/index.js ***!
  \***********************************/
    /*! exports provided: makeParser, parseText, rules, renderText */
    /***/ './src/react/markup/index.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module, R) {
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'makeParser',
          function() {
            return makeParser
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'parseText',
          function() {
            return parseText
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'renderText',
          function() {
            return renderText
          },
        )
        /* harmony import */ var _rules__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! ./rules */ './src/react/markup/rules.js',
        )
        /* harmony reexport (safe) */ __webpack_require__.d(
          __webpack_exports__,
          'rules',
          function() {
            return _rules__WEBPACK_IMPORTED_MODULE_0__['default']
          },
        )

        /* harmony import */ var utils_text__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! utils/text */ './src/react/utils/text.js',
        )
        var _extends =
          Object.assign ||
          function(target) {
            for (var i = 1; i < arguments.length; i++) {
              var source = arguments[i]
              for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                  target[key] = source[key]
                }
              }
            }
            return target
          }

        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        function _objectWithoutProperties(obj, keys) {
          var target = {}
          for (var i in obj) {
            if (keys.indexOf(i) >= 0) continue
            if (!Object.prototype.hasOwnProperty.call(obj, i)) continue
            target[i] = obj[i]
          }
          return target
        }

        setTimeout(function() {
          console.assert(
            typeof _rules__WEBPACK_IMPORTED_MODULE_0__['default'] !==
              'undefined',
            '[IMPORT]:',
            'rules',
            'from',
            './rules',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof utils_text__WEBPACK_IMPORTED_MODULE_1__['hashText'] !==
              'undefined',
            '[IMPORT]:',
            'hashText',
            'from',
            'utils/text',
            'is undefined.',
          )
        }, 0)
        var makeParser = function makeParser(_ref) {
          var type = _ref.type,
            pattern = _ref.pattern,
            inline = _ref.inline,
            _ref$process = _ref.process,
            process = _ref$process === undefined ? R.identity : _ref$process
          return function(text) {
            var regex = new RegExp(pattern, inline ? 'uy' : 'muy')
            var result = regex.exec(text)
            return (
              result &&
              process(
                _extends(
                  {
                    match: result,
                    content: result[1] || result[0],
                    index: regex.lastIndex,
                    type: type,
                  },
                  result.groups,
                ),
              )
            )
          }
        }

        var _R$pipe = R.pipe(
            R.map(function(tag) {
              return _extends({ parse: makeParser(tag) }, tag)
            }),
            R.values,
            R.sortBy(R.prop('order')),
            R.partition(R.prop('inline')),
          )(_rules__WEBPACK_IMPORTED_MODULE_0__['default']),
          inlineRules = _R$pipe[0],
          blockRules = _R$pipe[1]

        // Parse markup text to render tree

        var parseText = function parseText(text) {
          var multiline =
            arguments.length > 1 && arguments[1] !== undefined
              ? arguments[1]
              : true
          var lastIndex =
            arguments.length > 2 && arguments[2] !== undefined
              ? arguments[2]
              : 0

          var nodes = []
          var rules = multiline ? blockRules : inlineRules
          var types = R.pipe(R.pluck('type'), R.join(' '))(rules)
          var looplimit = 99 // hack to avoid infinite loops during development. Should not be needed when tests are passing.
          while (looplimit-- && text) {
            for (
              var _iterator = rules,
                _isArray = Array.isArray(_iterator),
                _i = 0,
                _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();
              ;

            ) {
              var _ref2

              if (_isArray) {
                if (_i >= _iterator.length) break
                _ref2 = _iterator[_i++]
              } else {
                _i = _iterator.next()
                if (_i.done) break
                _ref2 = _i.value
              }

              var rule = _ref2

              var result = rule.parse(text)
              if (result) {
                var index = result.index,
                  content = result.content,
                  node = _objectWithoutProperties(result, ['index', 'content'])

                if (rule.type != 'whitespace') {
                  if (R.contains(rule.type, ['text', 'character']))
                    nodes.push(content)
                  else {
                    var children = rule.leaf
                      ? content ? [content] : []
                      : parseText(content, R.contains('\n', content))
                    // node.index = lastIndex
                    // node.hash = hashText(match)
                    nodes.push(_extends({}, node, { children: children }))
                  }
                }
                lastIndex += index
                text = text.slice(index)
                break
              }
            }
          }
          return nodes
        }

        var cleanMarkup = R.pipe(
          R.replace(/“/g, '«'),
          R.replace(/”/g, '»'),
          R.replace(/--/g, '–'),
          R.replace(/([.!?;:] |^) ?[-–] ?/gm, '$1– '),
          R.replace(
            /\B"((?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*?)"\B/g,
            '«$1»',
          ),
          R.trim,
          R.replace(/\n{3,}/g, '\n\n'),
        )

        // Render parse tree to markup text
        var renderText = function renderText(tree) {
          var res = []
          for (
            var _iterator2 = tree,
              _isArray2 = Array.isArray(_iterator2),
              _i2 = 0,
              _iterator2 = _isArray2
                ? _iterator2
                : _iterator2[Symbol.iterator]();
            ;

          ) {
            var _ref3

            if (_isArray2) {
              if (_i2 >= _iterator2.length) break
              _ref3 = _iterator2[_i2++]
            } else {
              _i2 = _iterator2.next()
              if (_i2.done) break
              _ref3 = _i2.value
            }

            var node = _ref3

            if (R.is(String, node)) {
              res.push(node)
            } else {
              var rule =
                _rules__WEBPACK_IMPORTED_MODULE_0__['default'][node.type]
              res.push(
                rule.reverse(
                  _extends({}, node, { content: renderText(node.children) }),
                ),
              )
              if (!rule.inline) res.push('\n')
            }
          }
          return cleanMarkup(R.join('', res))
        }

        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            makeParser,
            'makeParser',
            '/app/src/react/markup/index.js',
          )
          reactHotLoader.register(
            inlineRules,
            'inlineRules',
            '/app/src/react/markup/index.js',
          )
          reactHotLoader.register(
            blockRules,
            'blockRules',
            '/app/src/react/markup/index.js',
          )
          reactHotLoader.register(
            parseText,
            'parseText',
            '/app/src/react/markup/index.js',
          )
          reactHotLoader.register(
            cleanMarkup,
            'cleanMarkup',
            '/app/src/react/markup/index.js',
          )
          reactHotLoader.register(
            renderText,
            'renderText',
            '/app/src/react/markup/index.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
        __webpack_require__(/*! ramda */ 'ramda'),
      ))

      /***/
    },

    /***/ /*!**************************************!*\
  !*** ./src/react/markup/nodeTree.js ***!
  \**************************************/
    /*! exports provided: getChildren, getPlaces, getLink, getPlaceChildren, buildNodeTree */
    /***/ './src/react/markup/nodeTree.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module, R) {
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'getChildren',
          function() {
            return getChildren
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'getPlaces',
          function() {
            return getPlaces
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'getLink',
          function() {
            return getLink
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'getPlaceChildren',
          function() {
            return getPlaceChildren
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'buildNodeTree',
          function() {
            return buildNodeTree
          },
        )
        /* harmony import */ var markup__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! markup */ './src/react/markup/index.js',
        )
        /* harmony import */ var utils_text__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! utils/text */ './src/react/utils/text.js',
        )
        var _extends =
          Object.assign ||
          function(target) {
            for (var i = 1; i < arguments.length; i++) {
              var source = arguments[i]
              for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                  target[key] = source[key]
                }
              }
            }
            return target
          }

        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        function _objectWithoutProperties(obj, keys) {
          var target = {}
          for (var i in obj) {
            if (keys.indexOf(i) >= 0) continue
            if (!Object.prototype.hasOwnProperty.call(obj, i)) continue
            target[i] = obj[i]
          }
          return target
        }

        setTimeout(function() {
          console.assert(
            typeof markup__WEBPACK_IMPORTED_MODULE_0__['rules'] !== 'undefined',
            '[IMPORT]:',
            'rules',
            'from',
            'markup',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof markup__WEBPACK_IMPORTED_MODULE_0__['parseText'] !==
              'undefined',
            '[IMPORT]:',
            'parseText',
            'from',
            'markup',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof utils_text__WEBPACK_IMPORTED_MODULE_1__['cleanText'] !==
              'undefined',
            '[IMPORT]:',
            'cleanText',
            'from',
            'utils/text',
            'is undefined.',
          )
        }, 0)
        var childTypes = [
          // child types in story redux state
          'images',
          'videos',
          'pullquotes',
          'asides',
          'inline_html_blocks',
        ]

        // :: {story} -> [{storychild}]
        var getChildren = R.pipe(
          R.pick(childTypes),
          R.mapObjIndexed(function(val, key, obj) {
            return R.map(R.assoc('type', R.replace(/s$/, '', key)), val)
          }),
          R.values,
          R.reduce(R.concat, []),
        )

        // :: {story} -> ['placement']
        var getPlaces = R.pipe(getChildren, R.pluck('placement'), R.uniq)

        // :: linkNode -> {story} -> {inline_html_link}
        var getLink = function getLink(_ref) {
          var ref = _ref.ref
          return R.pipe(
            R.prop('links'),
            R.find(R.propEq('number', parseInt(ref))),
          )
        }

        // :: {place} -> {story} -> [{storychild}]
        var getPlaceChildren = function getPlaceChildren(_ref2) {
          var name = _ref2.name
          return R.pipe(getChildren, R.filter(R.propEq('placement', name)))
        }

        // :: {story} -> {...story, nodeTree}
        var buildNodeTree = function buildNodeTree(story) {
          var title = story.title,
            kicker = story.kicker,
            lede = story.lede,
            theme_word = story.theme_word,
            bylines = story.bylines

          var walk = R.map(function(parseNode) {
            if (R.is(String, parseNode)) return parseNode

            var type = parseNode.type,
              children = parseNode.children,
              match = parseNode.match,
              props = _objectWithoutProperties(parseNode, [
                'type',
                'children',
                'match',
              ])

            if (children) props.children = walk(children)
            switch (type) {
              case 'place':
                props.children = R.pipe(
                  getPlaceChildren(parseNode),
                  R.sortBy(R.prop('ordering')),
                  R.map(
                    R.when(R.prop('bodytext_markup'), function(child) {
                      return _extends({}, child, {
                        children: R.pipe(
                          R.prop('bodytext_markup'),
                          R.replace(/@fakta:/gi, '@faktatit:'),
                          R.replace(/@sitat:/gi, ''),
                          markup__WEBPACK_IMPORTED_MODULE_0__['parseText'],
                          walk,
                        )(child),
                      })
                    }),
                  ),
                )(story)
                break
              case 'link':
                props.link = getLink(props)(story)
                break
              case 'blockTag':
                switch (props.tag) {
                  case 'fakta':
                    props.type = 'place'
                    props.children = [{ type: 'aside', children: children }]
                    break
                  case 'sitat':
                    props.type = 'place'
                    props.children = [{ type: 'pullquote', children: children }]
                    break
                  case 'bl':
                    bylines = R.append(parseByline(children[0]), bylines)
                    return null
                  case 'tit':
                    if (!title) {
                      title = match[1]
                      return null
                    }
                    break
                  case 'tema':
                    theme_word = match[1]
                    return null
                  case 'ing':
                    lede += match[1]
                    return null
                  case 'kicker':
                    kicker = match[1]
                    return null
                }
                break
            }
            return _extends({ type: type }, props)
          })

          var parseTree = Object(
            markup__WEBPACK_IMPORTED_MODULE_0__['parseText'],
          )(story.bodytext_markup)
          var nodeTree = walk(parseTree)

          return _extends({}, story, {
            title: title,
            kicker: kicker,
            lede: lede,
            theme_word: theme_word,
            bylines: bylines,
            parseTree: parseTree,
            nodeTree: nodeTree,
          })
        }

        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            childTypes,
            'childTypes',
            '/app/src/react/markup/nodeTree.js',
          )
          reactHotLoader.register(
            getChildren,
            'getChildren',
            '/app/src/react/markup/nodeTree.js',
          )
          reactHotLoader.register(
            getPlaces,
            'getPlaces',
            '/app/src/react/markup/nodeTree.js',
          )
          reactHotLoader.register(
            getLink,
            'getLink',
            '/app/src/react/markup/nodeTree.js',
          )
          reactHotLoader.register(
            getPlaceChildren,
            'getPlaceChildren',
            '/app/src/react/markup/nodeTree.js',
          )
          reactHotLoader.register(
            buildNodeTree,
            'buildNodeTree',
            '/app/src/react/markup/nodeTree.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
        __webpack_require__(/*! ramda */ 'ramda'),
      ))

      /***/
    },

    /***/ /*!***********************************!*\
  !*** ./src/react/markup/rules.js ***!
  \***********************************/
    /*! exports provided: TAGS, default */
    /***/ './src/react/markup/rules.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module, R) {
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'TAGS',
          function() {
            return TAGS
          },
        )
        /* harmony import */ var utils_text__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! utils/text */ './src/react/utils/text.js',
        )
        var _extends =
          Object.assign ||
          function(target) {
            for (var i = 1; i < arguments.length; i++) {
              var source = arguments[i]
              for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                  target[key] = source[key]
                }
              }
            }
            return target
          }

        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        function _objectWithoutProperties(obj, keys) {
          var target = {}
          for (var i in obj) {
            if (keys.indexOf(i) >= 0) continue
            if (!Object.prototype.hasOwnProperty.call(obj, i)) continue
            target[i] = obj[i]
          }
          return target
        }

        // lexer rules for the universitas markup language

        // These are the markup tags.
        // Usage example:
        // @txt: [content]
        setTimeout(function() {
          console.assert(
            typeof utils_text__WEBPACK_IMPORTED_MODULE_0__['makeFuzzer'] !==
              'undefined',
            '[IMPORT]:',
            'makeFuzzer',
            'from',
            'utils/text',
            'is undefined.',
          )
        }, 0)
        var TAGS = [
          'txt',
          'tingo',
          'mt',
          'bl',
          'ing',
          'tit',
          'tema',
          'sitatbyline',
          'spm',
          'fakta',
          'faktatit',
          'sitat',
        ]

        var leaf = true,
          inline = true // helpers for object shorthand

        var baseRules = {
          whitespace: {
            pattern: /\s+/m,
            order: 0,
          },
          escaped: {
            inline: inline,
            order: 0,
            type: 'character',
            pattern: /\\(\W)/,
          },
          character: {
            inline: inline,
            leaf: leaf,
            pattern: /./,
            order: 999,
          },
          text: {
            inline: inline,
            leaf: leaf,
            pattern: /[^\n\\_[]+/,
            order: 0,
          },
          link: {
            inline: inline,
            pattern: /\[(?<content>.*?)\](\((?<ref>.*)\))?/,
            reverse: function reverse(_ref) {
              var ref = _ref.ref,
                content = _ref.content
              return ref != content
                ? '[' + content + '](' + ref + ')'
                : '[' + content + ']'
            },
            process: function process(_ref2) {
              var ref = _ref2.ref,
                node = _objectWithoutProperties(_ref2, ['ref'])

              return _extends(
                {
                  ref: ref || node.content,
                },
                node,
              )
            },
          },
          em: {
            inline: inline,
            pattern: /_(?<content>.*?)_/,
            reverse: function reverse(_ref3) {
              var content = _ref3.content
              return '_' + content + '_'
            },
          },
          place: {
            leaf: leaf,
            pattern: /^ *\[\[ *(?<name>.*?) ( *\| *(?<flags>.*?))? *\]\] *$/,
            reverse: function reverse(_ref4) {
              var name = _ref4.name,
                _ref4$flags = _ref4.flags,
                flags = _ref4$flags === undefined ? '' : _ref4$flags
              return '\n[[ ' + name + (flags && ' | ') + flags + ' ]]\n'
            },
          },
          blockTag: {
            pattern: /^@(?<tag>[^:]*): ?(?<content>.*)$/,
            reverse: function reverse(_ref5) {
              var tag = _ref5.tag,
                content = _ref5.content

              var space = R.contains(tag, ['mt', 'spm', 'tingo']) ? '\n' : ''
              return space + '@' + tag + ': ' + content
            },
            process: R.evolve({
              tag: Object(
                utils_text__WEBPACK_IMPORTED_MODULE_0__['makeFuzzer'],
              )(TAGS, 0.5),
            }), // fuzzy match
          },
          listItem: {
            pattern: /^(\* |# |@li:) *(?<content>.*)$/,
            order: 9,
            reverse: function reverse(_ref6) {
              var content = _ref6.content
              return '# ' + content
            },
          },
          paragraph: {
            pattern: /^.*$/,
            order: 100,
          },
          facts: {
            pattern: /^@fakta:\s?(?<content>(\n?.+)+)$/,
            order: 1,
            reverse: function reverse(_ref7) {
              var content = _ref7.content
              return '\n@fakta: ' + content + '\n'
            },
          },
          pullquote: {
            pattern: /^@sitat:\s?(?<content>(\n?.+)+)$/,
            order: 1,
            reverse: function reverse(_ref8) {
              var content = _ref8.content
              return '\n@sitat: ' + content + '\n'
            },
          },

          // fallback lexer rule
        }
        var defaultRule = {
          order: 10,
          leaf: false,
          inline: false,
          reverse: R.propOr('[NO CONTENT]', 'content'),
        }

        var _default = R.pipe(
          R.map(R.merge(defaultRule)),
          R.mapObjIndexed(function(val, type, obj) {
            return _extends({ type: type }, val)
          }),
        )(baseRules)

        /* harmony default export */ __webpack_exports__['default'] = _default
        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            TAGS,
            'TAGS',
            '/app/src/react/markup/rules.js',
          )
          reactHotLoader.register(
            leaf,
            'leaf',
            '/app/src/react/markup/rules.js',
          )
          reactHotLoader.register(
            inline,
            'inline',
            '/app/src/react/markup/rules.js',
          )
          reactHotLoader.register(
            baseRules,
            'baseRules',
            '/app/src/react/markup/rules.js',
          )
          reactHotLoader.register(
            defaultRule,
            'defaultRule',
            '/app/src/react/markup/rules.js',
          )
          reactHotLoader.register(
            _default,
            'default',
            '/app/src/react/markup/rules.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
        __webpack_require__(/*! ramda */ 'ramda'),
      ))

      /***/
    },

    /***/ /*!******************************************!*\
  !*** ./src/react/sagas/frontPageSaga.js ***!
  \******************************************/
    /*! exports provided: default */
    /***/ './src/react/sagas/frontPageSaga.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module, R) {
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'default',
          function() {
            return rootSaga
          },
        )
        /* harmony import */ var redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! redux-saga/effects */ 'redux-saga/effects',
        )
        /* harmony import */ var redux_saga_effects__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
          redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__,
        )
        /* harmony import */ var redux_saga__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! redux-saga */ 'redux-saga',
        )
        /* harmony import */ var redux_saga__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(
          redux_saga__WEBPACK_IMPORTED_MODULE_1__,
        )
        /* harmony import */ var services_api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          /*! services/api */ './src/react/services/api.js',
        )
        /* harmony import */ var ducks_publicstory__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
          /*! ducks/publicstory */ './src/react/ducks/publicstory.js',
        )
        /* harmony import */ var ducks_site__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
          /*! ducks/site */ './src/react/ducks/site.js',
        )
        /* harmony import */ var ducks_issues__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
          /*! ducks/issues */ './src/react/ducks/issues.js',
        )
        /* harmony import */ var ducks_newsFeed__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
          /*! ducks/newsFeed */ './src/react/ducks/newsFeed.js',
        )
        var _extends =
          Object.assign ||
          function(target) {
            for (var i = 1; i < arguments.length; i++) {
              var source = arguments[i]
              for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                  target[key] = source[key]
                }
              }
            }
            return target
          }

        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        var _marked = /*#__PURE__*/ regeneratorRuntime.mark(rootSaga),
          _marked2 = /*#__PURE__*/ regeneratorRuntime.mark(fetchStory),
          _marked3 = /*#__PURE__*/ regeneratorRuntime.mark(fetchSearch),
          _marked4 = /*#__PURE__*/ regeneratorRuntime.mark(fetchFeed),
          _marked5 = /*#__PURE__*/ regeneratorRuntime.mark(fetchSite),
          _marked6 = /*#__PURE__*/ regeneratorRuntime.mark(fetchIssues)

        setTimeout(function() {
          console.assert(
            typeof redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__['select'] !==
              'undefined',
            '[IMPORT]:',
            'select',
            'from',
            'redux-saga/effects',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__['put'] !==
              'undefined',
            '[IMPORT]:',
            'put',
            'from',
            'redux-saga/effects',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__['call'] !==
              'undefined',
            '[IMPORT]:',
            'call',
            'from',
            'redux-saga/effects',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__[
              'takeEvery'
            ] !== 'undefined',
            '[IMPORT]:',
            'takeEvery',
            'from',
            'redux-saga/effects',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__[
              'takeLatest'
            ] !== 'undefined',
            '[IMPORT]:',
            'takeLatest',
            'from',
            'redux-saga/effects',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof redux_saga__WEBPACK_IMPORTED_MODULE_1__['delay'] !==
              'undefined',
            '[IMPORT]:',
            'delay',
            'from',
            'redux-saga',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof services_api__WEBPACK_IMPORTED_MODULE_2__['apiGet'] !==
              'undefined',
            '[IMPORT]:',
            'apiGet',
            'from',
            'services/api',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof services_api__WEBPACK_IMPORTED_MODULE_2__['apiList'] !==
              'undefined',
            '[IMPORT]:',
            'apiList',
            'from',
            'services/api',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof ducks_publicstory__WEBPACK_IMPORTED_MODULE_3__[
              'getStory'
            ] !== 'undefined',
            '[IMPORT]:',
            'getStory',
            'from',
            'ducks/publicstory',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof ducks_publicstory__WEBPACK_IMPORTED_MODULE_3__[
              'storyFetched'
            ] !== 'undefined',
            '[IMPORT]:',
            'storyFetched',
            'from',
            'ducks/publicstory',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof ducks_publicstory__WEBPACK_IMPORTED_MODULE_3__[
              'STORY_REQUESTED'
            ] !== 'undefined',
            '[IMPORT]:',
            'STORY_REQUESTED',
            'from',
            'ducks/publicstory',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof ducks_site__WEBPACK_IMPORTED_MODULE_4__['siteFetched'] !==
              'undefined',
            '[IMPORT]:',
            'siteFetched',
            'from',
            'ducks/site',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof ducks_site__WEBPACK_IMPORTED_MODULE_4__['SITE_REQUESTED'] !==
              'undefined',
            '[IMPORT]:',
            'SITE_REQUESTED',
            'from',
            'ducks/site',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof ducks_issues__WEBPACK_IMPORTED_MODULE_5__[
              'issuesFetched'
            ] !== 'undefined',
            '[IMPORT]:',
            'issuesFetched',
            'from',
            'ducks/issues',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof ducks_issues__WEBPACK_IMPORTED_MODULE_5__[
              'ISSUES_REQUESTED'
            ] !== 'undefined',
            '[IMPORT]:',
            'ISSUES_REQUESTED',
            'from',
            'ducks/issues',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof ducks_newsFeed__WEBPACK_IMPORTED_MODULE_6__[
              'getFeedQuery'
            ] !== 'undefined',
            '[IMPORT]:',
            'getFeedQuery',
            'from',
            'ducks/newsFeed',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof ducks_newsFeed__WEBPACK_IMPORTED_MODULE_6__[
              'searchFetched'
            ] !== 'undefined',
            '[IMPORT]:',
            'searchFetched',
            'from',
            'ducks/newsFeed',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof ducks_newsFeed__WEBPACK_IMPORTED_MODULE_6__[
              'feedFetched'
            ] !== 'undefined',
            '[IMPORT]:',
            'feedFetched',
            'from',
            'ducks/newsFeed',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof ducks_newsFeed__WEBPACK_IMPORTED_MODULE_6__['SEARCH'] !==
              'undefined',
            '[IMPORT]:',
            'SEARCH',
            'from',
            'ducks/newsFeed',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof ducks_newsFeed__WEBPACK_IMPORTED_MODULE_6__[
              'TOGGLE_LANGUAGE'
            ] !== 'undefined',
            '[IMPORT]:',
            'TOGGLE_LANGUAGE',
            'from',
            'ducks/newsFeed',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof ducks_newsFeed__WEBPACK_IMPORTED_MODULE_6__[
              'FEED_REQUESTED'
            ] !== 'undefined',
            '[IMPORT]:',
            'FEED_REQUESTED',
            'from',
            'ducks/newsFeed',
            'is undefined.',
          )
        }, 0)
        var DEBOUNCE = 300 // ms debounce

        function rootSaga() {
          return regeneratorRuntime.wrap(
            function rootSaga$(_context) {
              while (1) {
                switch ((_context.prev = _context.next)) {
                  case 0:
                    _context.next = 2
                    return Object(
                      redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__[
                        'takeLatest'
                      ],
                    )(
                      ducks_newsFeed__WEBPACK_IMPORTED_MODULE_6__[
                        'FEED_REQUESTED'
                      ],
                      fetchFeed,
                    )

                  case 2:
                    _context.next = 4
                    return Object(
                      redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__[
                        'takeLatest'
                      ],
                    )(
                      ducks_site__WEBPACK_IMPORTED_MODULE_4__['SITE_REQUESTED'],
                      fetchSite,
                    )

                  case 4:
                    _context.next = 6
                    return Object(
                      redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__[
                        'takeLatest'
                      ],
                    )(
                      ducks_issues__WEBPACK_IMPORTED_MODULE_5__[
                        'ISSUES_REQUESTED'
                      ],
                      fetchIssues,
                    )

                  case 6:
                    _context.next = 8
                    return Object(
                      redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__[
                        'takeLatest'
                      ],
                    )(
                      ducks_newsFeed__WEBPACK_IMPORTED_MODULE_6__['SEARCH'],
                      fetchSearch,
                    )

                  case 8:
                    _context.next = 10
                    return Object(
                      redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__[
                        'takeEvery'
                      ],
                    )(
                      ducks_publicstory__WEBPACK_IMPORTED_MODULE_3__[
                        'STORY_REQUESTED'
                      ],
                      fetchStory,
                    )

                  case 10:
                  case 'end':
                    return _context.stop()
                }
              }
            },
            _marked,
            this,
          )
        }

        var handleError = function handleError(error) {
          return console.error(error)
        }

        function fetchStory(action) {
          var _action$payload, id, prefetch, story, _ref, response, error

          return regeneratorRuntime.wrap(
            function fetchStory$(_context2) {
              while (1) {
                switch ((_context2.prev = _context2.next)) {
                  case 0:
                    ;(_action$payload = action.payload),
                      (id = _action$payload.id),
                      (prefetch = _action$payload.prefetch)
                    _context2.next = 3
                    return Object(
                      redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__['select'],
                    )(
                      ducks_publicstory__WEBPACK_IMPORTED_MODULE_3__[
                        'getStory'
                      ],
                    )

                  case 3:
                    story = _context2.sent

                    if (!(prefetch && story.fetching)) {
                      _context2.next = 6
                      break
                    }

                    return _context2.abrupt('return')

                  case 6:
                    _context2.next = 8
                    return Object(
                      redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__['call'],
                    )(
                      services_api__WEBPACK_IMPORTED_MODULE_2__['apiGet'],
                      'publicstories',
                      id,
                    )

                  case 8:
                    _ref = _context2.sent
                    response = _ref.response
                    error = _ref.error

                    if (!response) {
                      _context2.next = 16
                      break
                    }

                    _context2.next = 14
                    return Object(
                      redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__['put'],
                    )(
                      Object(
                        ducks_publicstory__WEBPACK_IMPORTED_MODULE_3__[
                          'storyFetched'
                        ],
                      )(response),
                    )

                  case 14:
                    _context2.next = 21
                    break

                  case 16:
                    _context2.next = 18
                    return Object(
                      redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__['call'],
                    )(handleError, _extends({ id: id }, error))

                  case 18:
                    if (!error.HTTPstatus) {
                      _context2.next = 21
                      break
                    }

                    _context2.next = 21
                    return Object(
                      redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__['put'],
                    )(
                      Object(
                        ducks_publicstory__WEBPACK_IMPORTED_MODULE_3__[
                          'storyFetched'
                        ],
                      )(_extends({ id: id }, error)),
                    )

                  case 21:
                  case 'end':
                    return _context2.stop()
                }
              }
            },
            _marked2,
            this,
          )
        }

        function fetchSearch(action) {
          var params, search, _ref2, response, error

          return regeneratorRuntime.wrap(
            function fetchSearch$(_context3) {
              while (1) {
                switch ((_context3.prev = _context3.next)) {
                  case 0:
                    _context3.next = 2
                    return Object(
                      redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__['select'],
                    )(
                      ducks_newsFeed__WEBPACK_IMPORTED_MODULE_6__[
                        'getFeedQuery'
                      ],
                    )

                  case 2:
                    params = _context3.sent
                    search = params.search

                    if (search) {
                      _context3.next = 9
                      break
                    }

                    _context3.next = 7
                    return Object(
                      redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__['put'],
                    )(
                      Object(
                        ducks_newsFeed__WEBPACK_IMPORTED_MODULE_6__[
                          'searchFetched'
                        ],
                      )({ results: [], next: false }),
                    )

                  case 7:
                    _context3.next = 23
                    break

                  case 9:
                    _context3.next = 11
                    return Object(
                      redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__['call'],
                    )(
                      redux_saga__WEBPACK_IMPORTED_MODULE_1__['delay'],
                      search.length > 3 ? DEBOUNCE : DEBOUNCE * 3,
                    )

                  case 11:
                    _context3.next = 13
                    return Object(
                      redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__['call'],
                    )(
                      services_api__WEBPACK_IMPORTED_MODULE_2__['apiList'],
                      'frontpage',
                      params,
                    )

                  case 13:
                    _ref2 = _context3.sent
                    response = _ref2.response
                    error = _ref2.error

                    if (!response) {
                      _context3.next = 21
                      break
                    }

                    _context3.next = 19
                    return Object(
                      redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__['put'],
                    )(
                      Object(
                        ducks_newsFeed__WEBPACK_IMPORTED_MODULE_6__[
                          'searchFetched'
                        ],
                      )(response),
                    )

                  case 19:
                    _context3.next = 23
                    break

                  case 21:
                    _context3.next = 23
                    return Object(
                      redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__['call'],
                    )(handleError, error)

                  case 23:
                  case 'end':
                    return _context3.stop()
                }
              }
            },
            _marked3,
            this,
          )
        }

        function fetchFeed(action) {
          var params, _ref3, response, error

          return regeneratorRuntime.wrap(
            function fetchFeed$(_context4) {
              while (1) {
                switch ((_context4.prev = _context4.next)) {
                  case 0:
                    _context4.next = 2
                    return Object(
                      redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__['select'],
                    )(
                      ducks_newsFeed__WEBPACK_IMPORTED_MODULE_6__[
                        'getFeedQuery'
                      ],
                    )

                  case 2:
                    params = _context4.sent

                    params = R.merge(params, action.payload)

                    if (R.isEmpty(params)) {
                      _context4.next = 7
                      break
                    }

                    _context4.next = 7
                    return Object(
                      redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__['call'],
                    )(
                      redux_saga__WEBPACK_IMPORTED_MODULE_1__['delay'],
                      DEBOUNCE,
                    )

                  case 7:
                    _context4.next = 9
                    return Object(
                      redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__['call'],
                    )(
                      services_api__WEBPACK_IMPORTED_MODULE_2__['apiList'],
                      'frontpage',
                      params,
                    )

                  case 9:
                    _ref3 = _context4.sent
                    response = _ref3.response
                    error = _ref3.error

                    if (!response) {
                      _context4.next = 17
                      break
                    }

                    _context4.next = 15
                    return Object(
                      redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__['put'],
                    )(
                      Object(
                        ducks_newsFeed__WEBPACK_IMPORTED_MODULE_6__[
                          'feedFetched'
                        ],
                      )(response),
                    )

                  case 15:
                    _context4.next = 19
                    break

                  case 17:
                    _context4.next = 19
                    return Object(
                      redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__['call'],
                    )(handleError, error)

                  case 19:
                  case 'end':
                    return _context4.stop()
                }
              }
            },
            _marked4,
            this,
          )
        }

        function fetchSite(action) {
          var _ref4, response, error

          return regeneratorRuntime.wrap(
            function fetchSite$(_context5) {
              while (1) {
                switch ((_context5.prev = _context5.next)) {
                  case 0:
                    _context5.next = 2
                    return Object(
                      redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__['call'],
                    )(
                      services_api__WEBPACK_IMPORTED_MODULE_2__['apiList'],
                      'site',
                      {},
                    )

                  case 2:
                    _ref4 = _context5.sent
                    response = _ref4.response
                    error = _ref4.error

                    if (!response) {
                      _context5.next = 10
                      break
                    }

                    _context5.next = 8
                    return Object(
                      redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__['put'],
                    )(
                      Object(
                        ducks_site__WEBPACK_IMPORTED_MODULE_4__['siteFetched'],
                      )(response),
                    )

                  case 8:
                    _context5.next = 12
                    break

                  case 10:
                    _context5.next = 12
                    return Object(
                      redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__['call'],
                    )(handleError, error)

                  case 12:
                  case 'end':
                    return _context5.stop()
                }
              }
            },
            _marked5,
            this,
          )
        }

        function fetchIssues(action) {
          var _ref5, response, error

          return regeneratorRuntime.wrap(
            function fetchIssues$(_context6) {
              while (1) {
                switch ((_context6.prev = _context6.next)) {
                  case 0:
                    _context6.next = 2
                    return Object(
                      redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__['call'],
                    )(
                      services_api__WEBPACK_IMPORTED_MODULE_2__['apiList'],
                      'issues',
                      {},
                    )

                  case 2:
                    _ref5 = _context6.sent
                    response = _ref5.response
                    error = _ref5.error

                    if (!response) {
                      _context6.next = 10
                      break
                    }

                    _context6.next = 8
                    return Object(
                      redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__['put'],
                    )(
                      Object(
                        ducks_issues__WEBPACK_IMPORTED_MODULE_5__[
                          'issuesFetched'
                        ],
                      )(response),
                    )

                  case 8:
                    _context6.next = 12
                    break

                  case 10:
                    _context6.next = 12
                    return Object(
                      redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__['call'],
                    )(handleError, error)

                  case 12:
                  case 'end':
                    return _context6.stop()
                }
              }
            },
            _marked6,
            this,
          )
        }
        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            DEBOUNCE,
            'DEBOUNCE',
            '/app/src/react/sagas/frontPageSaga.js',
          )
          reactHotLoader.register(
            rootSaga,
            'rootSaga',
            '/app/src/react/sagas/frontPageSaga.js',
          )
          reactHotLoader.register(
            handleError,
            'handleError',
            '/app/src/react/sagas/frontPageSaga.js',
          )
          reactHotLoader.register(
            fetchStory,
            'fetchStory',
            '/app/src/react/sagas/frontPageSaga.js',
          )
          reactHotLoader.register(
            fetchSearch,
            'fetchSearch',
            '/app/src/react/sagas/frontPageSaga.js',
          )
          reactHotLoader.register(
            fetchFeed,
            'fetchFeed',
            '/app/src/react/sagas/frontPageSaga.js',
          )
          reactHotLoader.register(
            fetchSite,
            'fetchSite',
            '/app/src/react/sagas/frontPageSaga.js',
          )
          reactHotLoader.register(
            fetchIssues,
            'fetchIssues',
            '/app/src/react/sagas/frontPageSaga.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
        __webpack_require__(/*! ramda */ 'ramda'),
      ))

      /***/
    },

    /***/ /*!***********************************!*\
  !*** ./src/react/services/api.js ***!
  \***********************************/
    /*! exports provided: httpOptions, searchUrl, apiFetch, apiLogin, apiLogout, apiUser, pushImageFile, apiList, apiGet, apiPatch, apiPost, apiDelete */
    /***/ './src/react/services/api.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module, R) {
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'httpOptions',
          function() {
            return httpOptions
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'searchUrl',
          function() {
            return searchUrl
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'apiFetch',
          function() {
            return apiFetch
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'apiLogin',
          function() {
            return apiLogin
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'apiLogout',
          function() {
            return apiLogout
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'apiUser',
          function() {
            return apiUser
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'pushImageFile',
          function() {
            return pushImageFile
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'apiList',
          function() {
            return apiList
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'apiGet',
          function() {
            return apiGet
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'apiPatch',
          function() {
            return apiPatch
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'apiPost',
          function() {
            return apiPost
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'apiDelete',
          function() {
            return apiDelete
          },
        )
        /* harmony import */ var isomorphic_fetch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! isomorphic-fetch */ 'isomorphic-fetch',
        )
        /* harmony import */ var isomorphic_fetch__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
          isomorphic_fetch__WEBPACK_IMPORTED_MODULE_0__,
        )
        /* harmony import */ var js_cookie__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! js-cookie */ 'js-cookie',
        )
        /* harmony import */ var js_cookie__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(
          js_cookie__WEBPACK_IMPORTED_MODULE_1__,
        )
        /* harmony import */ var utils_urls__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          /*! utils/urls */ './src/react/utils/urls.js',
        )
        var _extends =
          Object.assign ||
          function(target) {
            for (var i = 1; i < arguments.length; i++) {
              var source = arguments[i]
              for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                  target[key] = source[key]
                }
              }
            }
            return target
          }

        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        setTimeout(function() {
          console.assert(
            typeof isomorphic_fetch__WEBPACK_IMPORTED_MODULE_0___default.a !==
              'undefined',
            '[IMPORT]:',
            'fetch',
            'from',
            'isomorphic-fetch',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof js_cookie__WEBPACK_IMPORTED_MODULE_1__ !== 'undefined',
            '[IMPORT]:',
            'Cookies',
            'from',
            'js-cookie',
            'is undefined.',
          )
        }, 0)

        // base url for the api
        setTimeout(function() {
          console.assert(
            typeof utils_urls__WEBPACK_IMPORTED_MODULE_2__['queryString'] !==
              'undefined',
            '[IMPORT]:',
            'queryString',
            'from',
            'utils/urls',
            'is undefined.',
          )
        }, 0)
        var BASE_URL = '/api'

        // Set content type header
        var contentType = R.assocPath(['headers', 'Content-Type'])

        // Create a merge-able init mapping with body data and content type header
        // wrapBody :: Any -> Object
        var wrapBody = R.cond([
          [R.isNil, R.always({})], // no body
          [R.is(String), R.objOf('body')], // plain string (content-type auto)
          [R.is(global.FormData), R.objOf('body')], // multipart form (content-type auto)
          [
            R.T, // anything else is converted to JSON
            R.pipe(
              JSON.stringify,
              R.objOf('body'),
              contentType('application/json'),
            ),
          ],
        ])

        var mergeReduce = R.reduce(R.mergeDeepRight, {})
        var getCookie = function getCookie() {
          return {
            'X-CSRFToken':
              js_cookie__WEBPACK_IMPORTED_MODULE_1__['get']('csrftoken') ||
              'NO-CSRF-COOKIE',
          }
        }

        // Merge headers and body to build an init object for fetch spec
        var httpOptions = function httpOptions(head, body) {
          return mergeReduce([
            {
              method: 'GET', // default method
              credentials: 'same-origin',
            },
            { headers: getCookie() },
            R.defaultTo({}, head),
            wrapBody(body),
          ])
        }

        // build "search" url for api model list view with query parameters.
        // searchUrl :: String -> Object -> String
        var searchUrl = R.curryN(2, function(model) {
          var params =
            arguments.length > 1 && arguments[1] !== undefined
              ? arguments[1]
              : {}

          var query = Object(
            utils_urls__WEBPACK_IMPORTED_MODULE_2__['queryString'],
          )(params)
          return query
            ? BASE_URL + '/' + model + '/?' + query
            : BASE_URL + '/' + model + '/'
        })

        // Perform fetch return promise containing an object with either an
        // `error` or `response` property. {error: Object} | {response: Object}
        // apiFetch :: (String, Object, Any) -> Promise[Object]
        var apiFetch = function apiFetch(url) {
          var head =
            arguments.length > 1 && arguments[1] !== undefined
              ? arguments[1]
              : {}
          var body =
            arguments.length > 2 && arguments[2] !== undefined
              ? arguments[2]
              : null

          var init = httpOptions(head, body)
          return isomorphic_fetch__WEBPACK_IMPORTED_MODULE_0___default()(
            url,
            init,
          )
            .then(function(response) {
              return response
                .json() // api always should return json
                .catch(function(jsonError) {}) // ... except for DELETE
                .then(function(data) {
                  return _extends(
                    { HTTPstatus: response.status, url: url },
                    data,
                  )
                })
                .then(function(data) {
                  return response.ok ? { response: data } : { error: data }
                })
            })
            .catch(function(error) {
              return { error: error.toString() }
            }) // fetch error – not status code
        }

        // login user and set session cookie
        var apiLogin = function apiLogin(_ref) {
          var username = _ref.username,
            password = _ref.password
          return apiFetch(
            BASE_URL + '/rest-auth/login/',
            { method: 'POST' },
            { username: username, password: password },
          )
        }

        // logout user (invalidates cookies)
        var apiLogout = function apiLogout() {
          return apiFetch(BASE_URL + '/rest-auth/logout/', { method: 'POST' })
        }

        // fetch user data if authenticated or errors with status 403
        var apiUser = function apiUser() {
          return apiFetch(BASE_URL + '/rest-auth/user/', { method: 'GET' })
        }

        // generic action
        var apiAction = R.curry(function(model, action, head, data, pk) {
          return apiFetch(
            BASE_URL + '/' + model + '/' + pk + '/' + action + '/',
            head,
            data,
          )
        })

        // Push image file to desken
        // :: pk -> Promise
        var pushImageFile = apiAction(
          'photos',
          'push_file',
          { method: 'POST' },
          null,
        )

        // Get list data of `model` from django rest api
        var apiList = R.curry(function(model, params) {
          var url = searchUrl(model, params)
          return apiFetch(url)
        })

        // Get model instance data from api
        var apiGet = R.curry(function(model, id) {
          return apiFetch(BASE_URL + '/' + model + '/' + id + '/')
        })

        // Patch model instance data from api
        var apiPatch = R.curry(function(model, id, data) {
          var url = BASE_URL + '/' + model + '/' + id + '/'
          var head = { method: 'PATCH' }
          return apiFetch(url, head, data)
        })

        // Post new model instance to api
        var apiPost = R.curry(function(model, data) {
          var url = BASE_URL + '/' + model + '/'
          var head = { method: 'POST' }
          return apiFetch(url, head, data)
        })

        // Delete model instance in api
        var apiDelete = R.curry(function(model, id) {
          var url = BASE_URL + '/' + model + '/' + id + '/'
          return apiFetch(url, { method: 'DELETE' })
        })
        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            BASE_URL,
            'BASE_URL',
            '/app/src/react/services/api.js',
          )
          reactHotLoader.register(
            contentType,
            'contentType',
            '/app/src/react/services/api.js',
          )
          reactHotLoader.register(
            wrapBody,
            'wrapBody',
            '/app/src/react/services/api.js',
          )
          reactHotLoader.register(
            mergeReduce,
            'mergeReduce',
            '/app/src/react/services/api.js',
          )
          reactHotLoader.register(
            getCookie,
            'getCookie',
            '/app/src/react/services/api.js',
          )
          reactHotLoader.register(
            httpOptions,
            'httpOptions',
            '/app/src/react/services/api.js',
          )
          reactHotLoader.register(
            searchUrl,
            'searchUrl',
            '/app/src/react/services/api.js',
          )
          reactHotLoader.register(
            apiFetch,
            'apiFetch',
            '/app/src/react/services/api.js',
          )
          reactHotLoader.register(
            apiLogin,
            'apiLogin',
            '/app/src/react/services/api.js',
          )
          reactHotLoader.register(
            apiLogout,
            'apiLogout',
            '/app/src/react/services/api.js',
          )
          reactHotLoader.register(
            apiUser,
            'apiUser',
            '/app/src/react/services/api.js',
          )
          reactHotLoader.register(
            apiAction,
            'apiAction',
            '/app/src/react/services/api.js',
          )
          reactHotLoader.register(
            pushImageFile,
            'pushImageFile',
            '/app/src/react/services/api.js',
          )
          reactHotLoader.register(
            apiList,
            'apiList',
            '/app/src/react/services/api.js',
          )
          reactHotLoader.register(
            apiGet,
            'apiGet',
            '/app/src/react/services/api.js',
          )
          reactHotLoader.register(
            apiPatch,
            'apiPatch',
            '/app/src/react/services/api.js',
          )
          reactHotLoader.register(
            apiPost,
            'apiPost',
            '/app/src/react/services/api.js',
          )
          reactHotLoader.register(
            apiDelete,
            'apiDelete',
            '/app/src/react/services/api.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
        __webpack_require__(/*! ramda */ 'ramda'),
      ))

      /***/
    },

    /***/ /*!*******************************************!*\
  !*** ./src/react/styles/universitas.scss ***!
  \*******************************************/
    /*! no static exports found */
    /***/ './src/react/styles/universitas.scss': function(module, exports) {
      // empty (null-loader)
      /***/
    },

    /***/ /*!********************************!*\
  !*** ./src/react/utils/hoc.js ***!
  \********************************/
    /*! exports provided: requestData */
    /***/ './src/react/utils/hoc.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module, R, React) {
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'requestData',
          function() {
            return requestData
          },
        )
        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        function _objectWithoutProperties(obj, keys) {
          var target = {}
          for (var i in obj) {
            if (keys.indexOf(i) >= 0) continue
            if (!Object.prototype.hasOwnProperty.call(obj, i)) continue
            target[i] = obj[i]
          }
          return target
        }

        // (Component, str, Component?) -> render({fetching: bool, fetchData: fn, ...props})

        var requestData = function requestData(Wrapped, sentinel) {
          var Loader =
            arguments.length > 2 && arguments[2] !== undefined
              ? arguments[2]
              : function() {
                  return null
                }
          return function(props) {
            var fetching = props.fetching,
              fetchData = props.fetchData,
              data = _objectWithoutProperties(props, ['fetching', 'fetchData'])

            var isReady = sentinel ? R.has(sentinel) : R.isEmpty
            if (isReady(data)) return React.createElement(Wrapped, props)
            if (!fetching) fetchData()
            return React.createElement(Loader, props)
          }
        }

        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            requestData,
            'requestData',
            '/app/src/react/utils/hoc.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
        __webpack_require__(/*! ramda */ 'ramda'),
        __webpack_require__(/*! react */ 'react'),
      ))

      /***/
    },

    /***/ /*!*********************************!*\
  !*** ./src/react/utils/misc.js ***!
  \*********************************/
    /*! exports provided: compose, debounce, timeoutDebounce, isTouchDevice, isAndroid, isPWA, isIphone, isVisible, scrollToElement, scrollToTop, preFetchImages, eventHandler, staleAfter */
    /***/ './src/react/utils/misc.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module) {
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'compose',
          function() {
            return compose
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'debounce',
          function() {
            return debounce
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'timeoutDebounce',
          function() {
            return timeoutDebounce
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'isTouchDevice',
          function() {
            return isTouchDevice
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'isAndroid',
          function() {
            return isAndroid
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'isPWA',
          function() {
            return isPWA
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'isIphone',
          function() {
            return isIphone
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'isVisible',
          function() {
            return isVisible
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'scrollToElement',
          function() {
            return scrollToElement
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'scrollToTop',
          function() {
            return scrollToTop
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'preFetchImages',
          function() {
            return preFetchImages
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'eventHandler',
          function() {
            return eventHandler
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'staleAfter',
          function() {
            return staleAfter
          },
        )
        /* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! redux */ 'redux',
        )
        /* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
          redux__WEBPACK_IMPORTED_MODULE_0__,
        )
        /* harmony import */ var ramda__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! ramda */ 'ramda',
        )
        /* harmony import */ var ramda__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(
          ramda__WEBPACK_IMPORTED_MODULE_1__,
        )
        var _typeof =
          typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol'
            ? function(obj) {
                return typeof obj
              }
            : function(obj) {
                return obj &&
                  typeof Symbol === 'function' &&
                  obj.constructor === Symbol &&
                  obj !== Symbol.prototype
                  ? 'symbol'
                  : typeof obj
              }

        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        setTimeout(function() {
          console.assert(
            typeof redux__WEBPACK_IMPORTED_MODULE_0__ !== 'undefined',
            '[IMPORT]:',
            'Redux',
            'from',
            'redux',
            'is undefined.',
          )
        }, 0)

        // use redux devtools if available
        setTimeout(function() {
          console.assert(
            typeof ramda__WEBPACK_IMPORTED_MODULE_1__ !== 'undefined',
            '[IMPORT]:',
            'R',
            'from',
            'ramda',
            'is undefined.',
          )
        }, 0)
        var compose =
          ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) ===
            'object' &&
            window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
          redux__WEBPACK_IMPORTED_MODULE_0__['compose']

        // AnimationFrame based debounce function
        var debounce = function debounce(func, wait) {
          var minutes = null
          return function() {
            for (
              var _len = arguments.length, args = Array(_len), _key = 0;
              _key < _len;
              _key++
            ) {
              args[_key] = arguments[_key]
            }

            minutes && window.cancelAnimationFrame(minutes)
            minutes = window.requestAnimationFrame(function() {
              minutes = null
              func.apply(undefined, args)
            })
          }
        }

        // setTimeout based debounce function. Doesn't perform well in android chrome
        var timeoutDebounce = function timeoutDebounce(func, wait) {
          var timeout = null
          return function() {
            for (
              var _len2 = arguments.length, args = Array(_len2), _key2 = 0;
              _key2 < _len2;
              _key2++
            ) {
              args[_key2] = arguments[_key2]
            }

            timeout && clearTimeout(timeout)
            timeout = setTimeout(function() {
              timeout = null
              func.apply(undefined, args)
            }, wait)
          }
        }

        // check if client is a device with touch screen
        var isTouchDevice = function isTouchDevice() {
          return document && 'ontouchstart' in document.documentElement
        }

        // check if client is an Android device
        var isAndroid = function isAndroid() {
          return navigator && /android/i.test(navigator.userAgent)
        }

        // check if page is running as standalone Progressive Web App
        var isPWA = function isPWA() {
          return (
            window && window.matchMedia('(display-mode: standalone)').matches
          )
        }

        // check if client is an iPhone device
        var isIphone = function isIphone() {
          return navigator && /iphone/i.test(navigator.userAgent)
        }

        // check if dom element not below the fold
        var isVisible = function isVisible(element) {
          var padding =
            arguments.length > 1 && arguments[1] !== undefined
              ? arguments[1]
              : 0

          if (!element) return false
          return (
            window.scrollY + window.innerHeight > element.offsetTop - padding
          )
        }

        // scroll to element vertically. center window on element
        var scrollToElement = function scrollToElement() {
          var centerFromTop =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : 0.5
          return function(element) {
            if (!(element && window.scrollTo)) return
            var offset =
              (window.innerHeight - element.offsetHeight) * centerFromTop
            var scrollTop =
              offset < 0 ? element.offsetTop : element.offsetTop - offset
            window.scrollTo(0, scrollTop)
          }
        }

        // scroll to top of page
        var scrollToTop = function scrollToTop() {
          return window.scrollTo(window.scrollX, 0)
        }

        // fetch image file without a dom element to require it
        var preFetchImage = function preFetchImage(_ref) {
          var image = _ref.image

          if (!image) return
          var im = new Image()
          im.src = image
        }
        var preFetchImages = ramda__WEBPACK_IMPORTED_MODULE_1__['map'](
          preFetchImage,
        )

        // event handler wrapper
        var eventHandler = function eventHandler(_eventHandler) {
          for (
            var _len3 = arguments.length,
              args = Array(_len3 > 1 ? _len3 - 1 : 0),
              _key3 = 1;
            _key3 < _len3;
            _key3++
          ) {
            args[_key3 - 1] = arguments[_key3]
          }

          return function(e) {
            e.stopPropagation()
            e.preventDefault()
            _eventHandler.apply(undefined, args)
          }
        }

        // check if timestamp is stale
        // :: Number -> String|Number -> Boolean
        var staleAfter = function staleAfter(minutes) {
          return function(timestamp) {
            return (
              Date.now() - new Date(timestamp).valueOf() > minutes * 1000 * 60
            )
          }
        }
        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            compose,
            'compose',
            '/app/src/react/utils/misc.js',
          )
          reactHotLoader.register(
            debounce,
            'debounce',
            '/app/src/react/utils/misc.js',
          )
          reactHotLoader.register(
            timeoutDebounce,
            'timeoutDebounce',
            '/app/src/react/utils/misc.js',
          )
          reactHotLoader.register(
            isTouchDevice,
            'isTouchDevice',
            '/app/src/react/utils/misc.js',
          )
          reactHotLoader.register(
            isAndroid,
            'isAndroid',
            '/app/src/react/utils/misc.js',
          )
          reactHotLoader.register(
            isPWA,
            'isPWA',
            '/app/src/react/utils/misc.js',
          )
          reactHotLoader.register(
            isIphone,
            'isIphone',
            '/app/src/react/utils/misc.js',
          )
          reactHotLoader.register(
            isVisible,
            'isVisible',
            '/app/src/react/utils/misc.js',
          )
          reactHotLoader.register(
            scrollToElement,
            'scrollToElement',
            '/app/src/react/utils/misc.js',
          )
          reactHotLoader.register(
            scrollToTop,
            'scrollToTop',
            '/app/src/react/utils/misc.js',
          )
          reactHotLoader.register(
            preFetchImage,
            'preFetchImage',
            '/app/src/react/utils/misc.js',
          )
          reactHotLoader.register(
            preFetchImages,
            'preFetchImages',
            '/app/src/react/utils/misc.js',
          )
          reactHotLoader.register(
            eventHandler,
            'eventHandler',
            '/app/src/react/utils/misc.js',
          )
          reactHotLoader.register(
            staleAfter,
            'staleAfter',
            '/app/src/react/utils/misc.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
      ))

      /***/
    },

    /***/ /*!*********************************!*\
  !*** ./src/react/utils/text.js ***!
  \*********************************/
    /*! exports provided: toJson, makeFuzzer, cleanText, cleanup, stringify, tr, slugify, phoneFormat, formatDate, formatFileSize, utf8Decode, hashText */
    /***/ './src/react/utils/text.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module, R) {
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'toJson',
          function() {
            return toJson
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'makeFuzzer',
          function() {
            return makeFuzzer
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'cleanText',
          function() {
            return cleanText
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'cleanup',
          function() {
            return cleanup
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'stringify',
          function() {
            return stringify
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'tr',
          function() {
            return tr
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'slugify',
          function() {
            return slugify
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'phoneFormat',
          function() {
            return phoneFormat
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'formatDate',
          function() {
            return formatDate
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'formatFileSize',
          function() {
            return formatFileSize
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'utf8Decode',
          function() {
            return utf8Decode
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'hashText',
          function() {
            return hashText
          },
        )
        /* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! date-fns */ 'date-fns',
        )
        /* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
          date_fns__WEBPACK_IMPORTED_MODULE_0__,
        )
        /* harmony import */ var date_fns_locale_nb__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          /*! date-fns/locale/nb */ 'date-fns/locale/nb',
        )
        /* harmony import */ var date_fns_locale_nb__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(
          date_fns_locale_nb__WEBPACK_IMPORTED_MODULE_1__,
        )
        /* harmony import */ var json_stringify_pretty_compact__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          /*! json-stringify-pretty-compact */ 'json-stringify-pretty-compact',
        )
        /* harmony import */ var json_stringify_pretty_compact__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/ __webpack_require__.n(
          json_stringify_pretty_compact__WEBPACK_IMPORTED_MODULE_2__,
        )
        /* harmony import */ var fuzzyset__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
          /*! fuzzyset */ 'fuzzyset',
        )
        /* harmony import */ var fuzzyset__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/ __webpack_require__.n(
          fuzzyset__WEBPACK_IMPORTED_MODULE_3__,
        )
        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        setTimeout(function() {
          console.assert(
            typeof date_fns__WEBPACK_IMPORTED_MODULE_0__['format'] !==
              'undefined',
            '[IMPORT]:',
            'format',
            'from',
            'date-fns',
            'is undefined.',
          )
        }, 0)
        setTimeout(function() {
          console.assert(
            typeof date_fns__WEBPACK_IMPORTED_MODULE_0__[
              'distanceInWordsToNow'
            ] !== 'undefined',
            '[IMPORT]:',
            'distanceInWordsToNow',
            'from',
            'date-fns',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof date_fns_locale_nb__WEBPACK_IMPORTED_MODULE_1___default.a !==
              'undefined',
            '[IMPORT]:',
            'norwayLocale',
            'from',
            'date-fns/locale/nb',
            'is undefined.',
          )
        }, 0)

        setTimeout(function() {
          console.assert(
            typeof json_stringify_pretty_compact__WEBPACK_IMPORTED_MODULE_2___default.a !==
              'undefined',
            '[IMPORT]:',
            'prettyJson',
            'from',
            'json-stringify-pretty-compact',
            'is undefined.',
          )
        }, 0)

        // pretty JSON
        setTimeout(function() {
          console.assert(
            typeof fuzzyset__WEBPACK_IMPORTED_MODULE_3___default.a !==
              'undefined',
            '[IMPORT]:',
            'FuzzySet',
            'from',
            'fuzzyset',
            'is undefined.',
          )
        }, 0)
        var toJson = R.tryCatch(
          json_stringify_pretty_compact__WEBPACK_IMPORTED_MODULE_2___default.a,
          function(e, data) {
            return JSON.stringify(e, Object.getOwnPropertyNames(e))
          },
        )

        // Fuzzy matcher
        // :: ([str], number) -> str -> str
        var makeFuzzer = function makeFuzzer(candidates) {
          var cutoff =
            arguments.length > 1 && arguments[1] !== undefined
              ? arguments[1]
              : 0.5

          var fuzzer = fuzzyset__WEBPACK_IMPORTED_MODULE_3___default()(
            candidates,
          )
          return R.either(
            R.pipe(
              function(t) {
                return fuzzer.get(t) || []
              },
              R.filter(R.propSatisfies(R.lt(cutoff), '0')),
              R.path([0, 1]),
            ),
            R.identity,
          )
        }

        // :: string -> string

        var NBRS = '\xA0'
        var WORDJOINER = '\u2060'

        // Fixify stuff
        var cleanText = R.pipe(
          R.replace(/--/g, '–'),
          R.replace(
            /(^|[!\.:\?] +)[\-\u2013] ?\b/gm,
            '$1\u2013' + WORDJOINER + NBRS,
          ),
        )

        // old cleanup function
        var cleanup = function cleanup(text) {
          return text
            .replace(/^(@\S+:)/gm, function(s) {
              return s.toLowerCase()
            })
            .replace(/^ *(@\S+:) *\b/gm, '$1 ')
            .replace(/^@t: */gm, '@txt: ')
            .replace(/[«"]([^"»«]*)"/g, '«$1»')
            .replace(/"/g, '«')
            .replace(/--/g, '–')
            .replace(/^[-–] *\b/gm, '– ')
            .replace(/^@text:/gm, '@txt:')
            .replace(/\n+@m$/gm, '\n\n@mt: ')
            .replace(/^./gm, function(s) {
              return s.toUpperCase()
            })
        }

        // :: * -> string
        var stringify = R.cond([
          [R.is(String), R.identity],
          [R.isNil, R.always('')],
          [R.T, R.toString],
        ])

        // like unix `tr` tranlate program
        // :: str -> str -> str -> str
        var tr = R.curry(function(a, b, text) {
          var trans = R.zipObj(R.split('', a), R.split('', b))
          return R.pipe(
            R.map(function(l) {
              return trans[l] || l
            }),
            R.join(''),
          )(text)
        })

        // :: string -> string
        var slugify = R.pipe(
          R.toLower,
          R.replace(/['"]/g, ''),
          tr('æåàáäâèéëêìíïîòóøöôùúüûñç', 'aaaaaaeeeeiiiiooooouuuunc'),
          R.replace(/[^a-z0-9]+/g, ' '),
          R.trim,
          R.replace(/ +/g, '-'),
        )

        // :: int|string -> string
        var phoneFormat = R.pipe(
          stringify,
          R.trim,
          R.ifElse(Boolean, R.identity, R.always('–')),
          R.replace(/ /g, ''),
          R.replace(/(\+\d\d)?(\d{3})(\d{2})(\d{3})$/, '$1 $2 $3 $4'),
        )

        // :: string|Date -> string
        var formatDate = function formatDate(value) {
          var dateformat =
            arguments.length > 1 && arguments[1] !== undefined
              ? arguments[1]
              : 'ddd DD. MMM YYYY'
          var locale =
            arguments.length > 2 && arguments[2] !== undefined
              ? arguments[2]
              : date_fns_locale_nb__WEBPACK_IMPORTED_MODULE_1___default.a
          var relative =
            arguments.length > 3 && arguments[3] !== undefined
              ? arguments[3]
              : false
          return relative
            ? Object(
                date_fns__WEBPACK_IMPORTED_MODULE_0__['distanceInWordsToNow'],
              )(new Date(value), { addSuffix: true, locale: locale })
            : Object(date_fns__WEBPACK_IMPORTED_MODULE_0__['format'])(
                new Date(value),
                dateformat,
                { locale: locale },
              )
        }

        // :: number -> string
        var toFixed = R.curryN(2, function(digits, number) {
          return number.toPrecision(digits)
        })

        // :: number -> string
        var formatFileSize = function formatFileSize() {
          var size =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : 0
          var digits =
            arguments.length > 1 && arguments[1] !== undefined
              ? arguments[1]
              : 3

          var units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
          var multiple = size ? Math.floor(Math.log10(size) / 3) : 0
          var number = multiple
            ? toFixed(digits, size / Math.pow(10, multiple * 3))
            : size
          var unit = units[multiple]
          var nbrspace = '\xA0'
          return unit ? '' + number + nbrspace + unit : 'very bigly large size'
        }

        // Exif utility. Text fields are often encoded in utf8.
        // :: utf-8 encoded string -> unicode string
        var utf8Decode = R.when(
          R.is(String),
          R.pipe(
            R.replace(/\xc5\x92/g, 'å'), // workaround unknown encoding
            R.replace(/\xc2\xbf/g, 'ø'), // workaround unknown encoding
            R.tryCatch(R.pipe(escape, decodeURIComponent), R.nthArg(1)),
            R.trim,
          ),
        )

        // simple text hasher
        // :: string -> number
        var hashText = function hashText(text) {
          var hash = 0
          var i = text.length
          while (i--) {
            hash = ((hash << 5) - hash + text.charCodeAt(i)) << 0
          }
          return hash
        }
        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            toJson,
            'toJson',
            '/app/src/react/utils/text.js',
          )
          reactHotLoader.register(
            makeFuzzer,
            'makeFuzzer',
            '/app/src/react/utils/text.js',
          )
          reactHotLoader.register(NBRS, 'NBRS', '/app/src/react/utils/text.js')
          reactHotLoader.register(
            WORDJOINER,
            'WORDJOINER',
            '/app/src/react/utils/text.js',
          )
          reactHotLoader.register(
            cleanText,
            'cleanText',
            '/app/src/react/utils/text.js',
          )
          reactHotLoader.register(
            cleanup,
            'cleanup',
            '/app/src/react/utils/text.js',
          )
          reactHotLoader.register(
            stringify,
            'stringify',
            '/app/src/react/utils/text.js',
          )
          reactHotLoader.register(tr, 'tr', '/app/src/react/utils/text.js')
          reactHotLoader.register(
            slugify,
            'slugify',
            '/app/src/react/utils/text.js',
          )
          reactHotLoader.register(
            phoneFormat,
            'phoneFormat',
            '/app/src/react/utils/text.js',
          )
          reactHotLoader.register(
            formatDate,
            'formatDate',
            '/app/src/react/utils/text.js',
          )
          reactHotLoader.register(
            toFixed,
            'toFixed',
            '/app/src/react/utils/text.js',
          )
          reactHotLoader.register(
            formatFileSize,
            'formatFileSize',
            '/app/src/react/utils/text.js',
          )
          reactHotLoader.register(
            utf8Decode,
            'utf8Decode',
            '/app/src/react/utils/text.js',
          )
          reactHotLoader.register(
            hashText,
            'hashText',
            '/app/src/react/utils/text.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
        __webpack_require__(/*! ramda */ 'ramda'),
      ))

      /***/
    },

    /***/ /*!*********************************!*\
  !*** ./src/react/utils/urls.js ***!
  \*********************************/
    /*! exports provided: paramPairs, cleanValues, isEmpty, queryString, parseParam, parseQuery, absoluteURL */
    /***/ './src/react/utils/urls.js': function(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* WEBPACK VAR INJECTION */ ;(function(module, R) {
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'paramPairs',
          function() {
            return paramPairs
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'cleanValues',
          function() {
            return cleanValues
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'isEmpty',
          function() {
            return isEmpty
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'queryString',
          function() {
            return queryString
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'parseParam',
          function() {
            return parseParam
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'parseQuery',
          function() {
            return parseQuery
          },
        )
        /* harmony export (binding) */ __webpack_require__.d(
          __webpack_exports__,
          'absoluteURL',
          function() {
            return absoluteURL
          },
        )
        ;(function() {
          var enterModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).enterModule

          enterModule && enterModule(module)
        })()

        // paramPairs :: (String | Array, String, Object) -> { String : String }
        var paramPairs = function paramPairs(key, value) {
          return R.is(Array, value)
            ? key + '=' + value.map(cleanValues).join(',')
            : key + '=' + cleanValues(value)
        }

        // convert query data to url paramater string
        // cleanValues :: Number|String -> String
        var cleanValues = R.pipe(
          String,
          R.trim,
          R.replace(/\s+/g, ' '),
          encodeURIComponent,
        )

        // Emptiness test where the falsy values 0 and false are not empty
        // but trythy values {} and [] are empty.
        // isEmpty :: Any -> Boolean
        var isEmpty = R.contains(R.__, [{}, undefined, null, [], ''])

        // flipify mapObjectIndexed
        // ((k, v) -> A) -> Object[k, v] -> Array[A]
        var mapObject = function mapObject(fn) {
          return R.pipe(
            R.mapObjIndexed(function(val, key, _) {
              return fn(key, val)
            }),
            R.values,
          )
        }

        // Build url safe querystring from object mapping.
        // queryString :: Obj -> String
        var queryString = R.pipe(
          R.reject(isEmpty),
          mapObject(paramPairs),
          R.join('&'),
        )

        // Parse query param string to value
        // value -> String | Number | Array
        var parseParam = R.cond([
          [R.test(/^[0-9.]+$/), parseFloat],
          [
            R.test(/,/),
            R.pipe(
              R.split(','),
              R.map(function(v) {
                return parseParam(v)
              }),
            ),
          ],
          [R.T, R.identity],
        ])

        // Parse an url or a querystring to get a mapping of query parameters
        // String -> {String: String|Number|Array}
        var parseQuery = R.pipe(
          R.tryCatch(
            R.pipe(R.constructN(1, URL), function(url) {
              return url.searchParams
            }),
            R.pipe(R.nthArg(1), R.constructN(1, URLSearchParams)),
          ),
          Array.from,
          R.fromPairs,
          R.map(parseParam),
        )

        // Relative to absolute url (requires global `location`)
        var absoluteURL = function absoluteURL(url) {
          return new URL(url, global.location.href).toString()
        }
        ;(function() {
          var reactHotLoader = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).default

          var leaveModule = __webpack_require__(
            /*! react-hot-loader */ 'react-hot-loader',
          ).leaveModule

          if (!reactHotLoader) {
            return
          }

          reactHotLoader.register(
            paramPairs,
            'paramPairs',
            '/app/src/react/utils/urls.js',
          )
          reactHotLoader.register(
            cleanValues,
            'cleanValues',
            '/app/src/react/utils/urls.js',
          )
          reactHotLoader.register(
            isEmpty,
            'isEmpty',
            '/app/src/react/utils/urls.js',
          )
          reactHotLoader.register(
            mapObject,
            'mapObject',
            '/app/src/react/utils/urls.js',
          )
          reactHotLoader.register(
            queryString,
            'queryString',
            '/app/src/react/utils/urls.js',
          )
          reactHotLoader.register(
            parseParam,
            'parseParam',
            '/app/src/react/utils/urls.js',
          )
          reactHotLoader.register(
            parseQuery,
            'parseQuery',
            '/app/src/react/utils/urls.js',
          )
          reactHotLoader.register(
            absoluteURL,
            'absoluteURL',
            '/app/src/react/utils/urls.js',
          )
          leaveModule(module)
        })()
        /* WEBPACK VAR INJECTION */
      }.call(
        this,
        __webpack_require__(
          /*! ./../../../node_modules/webpack/buildin/harmony-module.js */ './node_modules/webpack/buildin/harmony-module.js',
        )(module),
        __webpack_require__(/*! ramda */ 'ramda'),
      ))

      /***/
    },

    /***/ /*!*********************************!*\
  !*** external "babel-polyfill" ***!
  \*********************************/
    /*! no static exports found */
    /***/ 'babel-polyfill': function(module, exports) {
      module.exports = require('babel-polyfill')

      /***/
    },

    /***/ /*!*****************************!*\
  !*** external "classnames" ***!
  \*****************************/
    /*! no static exports found */
    /***/ classnames: function(module, exports) {
      module.exports = require('classnames')

      /***/
    },

    /***/ /*!***************************!*\
  !*** external "date-fns" ***!
  \***************************/
    /*! no static exports found */
    /***/ 'date-fns': function(module, exports) {
      module.exports = require('date-fns')

      /***/
    },

    /***/ /*!*************************************!*\
  !*** external "date-fns/locale/nb" ***!
  \*************************************/
    /*! no static exports found */
    /***/ 'date-fns/locale/nb': function(module, exports) {
      module.exports = require('date-fns/locale/nb')

      /***/
    },

    /***/ /*!**************************!*\
  !*** external "express" ***!
  \**************************/
    /*! no static exports found */
    /***/ express: function(module, exports) {
      module.exports = require('express')

      /***/
    },

    /***/ /*!***************************!*\
  !*** external "fuzzyset" ***!
  \***************************/
    /*! no static exports found */
    /***/ fuzzyset: function(module, exports) {
      module.exports = require('fuzzyset')

      /***/
    },

    /***/ /*!***********************************!*\
  !*** external "isomorphic-fetch" ***!
  \***********************************/
    /*! no static exports found */
    /***/ 'isomorphic-fetch': function(module, exports) {
      module.exports = require('isomorphic-fetch')

      /***/
    },

    /***/ /*!****************************!*\
  !*** external "js-cookie" ***!
  \****************************/
    /*! no static exports found */
    /***/ 'js-cookie': function(module, exports) {
      module.exports = require('js-cookie')

      /***/
    },

    /***/ /*!************************************************!*\
  !*** external "json-stringify-pretty-compact" ***!
  \************************************************/
    /*! no static exports found */
    /***/ 'json-stringify-pretty-compact': function(module, exports) {
      module.exports = require('json-stringify-pretty-compact')

      /***/
    },

    /***/ /*!*************************!*\
  !*** external "morgan" ***!
  \*************************/
    /*! no static exports found */
    /***/ morgan: function(module, exports) {
      module.exports = require('morgan')

      /***/
    },

    /***/ /*!************************!*\
  !*** external "ramda" ***!
  \************************/
    /*! no static exports found */
    /***/ ramda: function(module, exports) {
      module.exports = require('ramda')

      /***/
    },

    /***/ /*!************************!*\
  !*** external "react" ***!
  \************************/
    /*! no static exports found */
    /***/ react: function(module, exports) {
      module.exports = require('react')

      /***/
    },

    /***/ /*!***********************************!*\
  !*** external "react-dom/server" ***!
  \***********************************/
    /*! no static exports found */
    /***/ 'react-dom/server': function(module, exports) {
      module.exports = require('react-dom/server')

      /***/
    },

    /***/ /*!***************************************!*\
  !*** external "react-error-boundary" ***!
  \***************************************/
    /*! no static exports found */
    /***/ 'react-error-boundary': function(module, exports) {
      module.exports = require('react-error-boundary')

      /***/
    },

    /***/ /*!*******************************!*\
  !*** external "react-helmet" ***!
  \*******************************/
    /*! no static exports found */
    /***/ 'react-helmet': function(module, exports) {
      module.exports = require('react-helmet')

      /***/
    },

    /***/ /*!***********************************!*\
  !*** external "react-hot-loader" ***!
  \***********************************/
    /*! no static exports found */
    /***/ 'react-hot-loader': function(module, exports) {
      module.exports = require('react-hot-loader')

      /***/
    },

    /***/ /*!**********************************************************!*\
  !*** external "react-icons/lib/fa/exclamation-triangle" ***!
  \**********************************************************/
    /*! no static exports found */
    /***/ 'react-icons/lib/fa/exclamation-triangle': function(module, exports) {
      module.exports = require('react-icons/lib/fa/exclamation-triangle')

      /***/
    },

    /***/ /*!********************************************!*\
  !*** external "react-icons/lib/fa/header" ***!
  \********************************************/
    /*! no static exports found */
    /***/ 'react-icons/lib/fa/header': function(module, exports) {
      module.exports = require('react-icons/lib/fa/header')

      /***/
    },

    /***/ /*!*******************************************!*\
  !*** external "react-icons/lib/fa/magic" ***!
  \*******************************************/
    /*! no static exports found */
    /***/ 'react-icons/lib/fa/magic': function(module, exports) {
      module.exports = require('react-icons/lib/fa/magic')

      /***/
    },

    /***/ /*!*****************************************************!*\
  !*** external "react-icons/lib/fa/question-circle" ***!
  \*****************************************************/
    /*! no static exports found */
    /***/ 'react-icons/lib/fa/question-circle': function(module, exports) {
      module.exports = require('react-icons/lib/fa/question-circle')

      /***/
    },

    /***/ /*!*************************************************!*\
  !*** external "react-icons/lib/md/access-time" ***!
  \*************************************************/
    /*! no static exports found */
    /***/ 'react-icons/lib/md/access-time': function(module, exports) {
      module.exports = require('react-icons/lib/md/access-time')

      /***/
    },

    /***/ /*!************************************************!*\
  !*** external "react-icons/lib/md/add-circle" ***!
  \************************************************/
    /*! no static exports found */
    /***/ 'react-icons/lib/md/add-circle': function(module, exports) {
      module.exports = require('react-icons/lib/md/add-circle')

      /***/
    },

    /***/ /*!**************************************************!*\
  !*** external "react-icons/lib/md/announcement" ***!
  \**************************************************/
    /*! no static exports found */
    /***/ 'react-icons/lib/md/announcement': function(module, exports) {
      module.exports = require('react-icons/lib/md/announcement')

      /***/
    },

    /***/ /*!***************************************************!*\
  !*** external "react-icons/lib/md/arrow-forward" ***!
  \***************************************************/
    /*! no static exports found */
    /***/ 'react-icons/lib/md/arrow-forward': function(module, exports) {
      module.exports = require('react-icons/lib/md/arrow-forward')

      /***/
    },

    /***/ /*!***********************************************!*\
  !*** external "react-icons/lib/md/art-track" ***!
  \***********************************************/
    /*! no static exports found */
    /***/ 'react-icons/lib/md/art-track': function(module, exports) {
      module.exports = require('react-icons/lib/md/art-track')

      /***/
    },

    /***/ /*!*************************************************!*\
  !*** external "react-icons/lib/md/camera-roll" ***!
  \*************************************************/
    /*! no static exports found */
    /***/ 'react-icons/lib/md/camera-roll': function(module, exports) {
      module.exports = require('react-icons/lib/md/camera-roll')

      /***/
    },

    /***/ /*!*******************************************!*\
  !*** external "react-icons/lib/md/clear" ***!
  \*******************************************/
    /*! no static exports found */
    /***/ 'react-icons/lib/md/clear': function(module, exports) {
      module.exports = require('react-icons/lib/md/clear')

      /***/
    },

    /***/ /*!*******************************************!*\
  !*** external "react-icons/lib/md/close" ***!
  \*******************************************/
    /*! no static exports found */
    /***/ 'react-icons/lib/md/close': function(module, exports) {
      module.exports = require('react-icons/lib/md/close')

      /***/
    },

    /***/ /*!*********************************************!*\
  !*** external "react-icons/lib/md/comment" ***!
  \*********************************************/
    /*! no static exports found */
    /***/ 'react-icons/lib/md/comment': function(module, exports) {
      module.exports = require('react-icons/lib/md/comment')

      /***/
    },

    /***/ /*!******************************************!*\
  !*** external "react-icons/lib/md/crop" ***!
  \******************************************/
    /*! no static exports found */
    /***/ 'react-icons/lib/md/crop': function(module, exports) {
      module.exports = require('react-icons/lib/md/crop')

      /***/
    },

    /***/ /*!********************************************!*\
  !*** external "react-icons/lib/md/delete" ***!
  \********************************************/
    /*! no static exports found */
    /***/ 'react-icons/lib/md/delete': function(module, exports) {
      module.exports = require('react-icons/lib/md/delete')

      /***/
    },

    /***/ /*!*************************************************!*\
  !*** external "react-icons/lib/md/description" ***!
  \*************************************************/
    /*! no static exports found */
    /***/ 'react-icons/lib/md/description': function(module, exports) {
      module.exports = require('react-icons/lib/md/description')

      /***/
    },

    /***/ /*!******************************************!*\
  !*** external "react-icons/lib/md/done" ***!
  \******************************************/
    /*! no static exports found */
    /***/ 'react-icons/lib/md/done': function(module, exports) {
      module.exports = require('react-icons/lib/md/done')

      /***/
    },

    /***/ /*!******************************************!*\
  !*** external "react-icons/lib/md/edit" ***!
  \******************************************/
    /*! no static exports found */
    /***/ 'react-icons/lib/md/edit': function(module, exports) {
      module.exports = require('react-icons/lib/md/edit')

      /***/
    },

    /***/ /*!*******************************************!*\
  !*** external "react-icons/lib/md/email" ***!
  \*******************************************/
    /*! no static exports found */
    /***/ 'react-icons/lib/md/email': function(module, exports) {
      module.exports = require('react-icons/lib/md/email')

      /***/
    },

    /***/ /*!*******************************************!*\
  !*** external "react-icons/lib/md/error" ***!
  \*******************************************/
    /*! no static exports found */
    /***/ 'react-icons/lib/md/error': function(module, exports) {
      module.exports = require('react-icons/lib/md/error')

      /***/
    },

    /***/ /*!***************************************************!*\
  !*** external "react-icons/lib/md/file-download" ***!
  \***************************************************/
    /*! no static exports found */
    /***/ 'react-icons/lib/md/file-download': function(module, exports) {
      module.exports = require('react-icons/lib/md/file-download')

      /***/
    },

    /***/ /*!*************************************************!*\
  !*** external "react-icons/lib/md/file-upload" ***!
  \*************************************************/
    /*! no static exports found */
    /***/ 'react-icons/lib/md/file-upload': function(module, exports) {
      module.exports = require('react-icons/lib/md/file-upload')

      /***/
    },

    /***/ /*!**********************************************************!*\
  !*** external "react-icons/lib/md/format-list-bulleted" ***!
  \**********************************************************/
    /*! no static exports found */
    /***/ 'react-icons/lib/md/format-list-bulleted': function(module, exports) {
      module.exports = require('react-icons/lib/md/format-list-bulleted')

      /***/
    },

    /***/ /*!**************************************************!*\
  !*** external "react-icons/lib/md/format-quote" ***!
  \**************************************************/
    /*! no static exports found */
    /***/ 'react-icons/lib/md/format-quote': function(module, exports) {
      module.exports = require('react-icons/lib/md/format-quote')

      /***/
    },

    /***/ /*!*****************************************************!*\
  !*** external "react-icons/lib/md/import-contacts" ***!
  \*****************************************************/
    /*! no static exports found */
    /***/ 'react-icons/lib/md/import-contacts': function(module, exports) {
      module.exports = require('react-icons/lib/md/import-contacts')

      /***/
    },

    /***/ /*!******************************************!*\
  !*** external "react-icons/lib/md/info" ***!
  \******************************************/
    /*! no static exports found */
    /***/ 'react-icons/lib/md/info': function(module, exports) {
      module.exports = require('react-icons/lib/md/info')

      /***/
    },

    /***/ /*!*******************************************************!*\
  !*** external "react-icons/lib/md/laptop-chromebook" ***!
  \*******************************************************/
    /*! no static exports found */
    /***/ 'react-icons/lib/md/laptop-chromebook': function(module, exports) {
      module.exports = require('react-icons/lib/md/laptop-chromebook')

      /***/
    },

    /***/ /*!******************************************!*\
  !*** external "react-icons/lib/md/link" ***!
  \******************************************/
    /*! no static exports found */
    /***/ 'react-icons/lib/md/link': function(module, exports) {
      module.exports = require('react-icons/lib/md/link')

      /***/
    },

    /***/ /*!******************************************!*\
  !*** external "react-icons/lib/md/loop" ***!
  \******************************************/
    /*! no static exports found */
    /***/ 'react-icons/lib/md/loop': function(module, exports) {
      module.exports = require('react-icons/lib/md/loop')

      /***/
    },

    /***/ /*!******************************************!*\
  !*** external "react-icons/lib/md/menu" ***!
  \******************************************/
    /*! no static exports found */
    /***/ 'react-icons/lib/md/menu': function(module, exports) {
      module.exports = require('react-icons/lib/md/menu')

      /***/
    },

    /***/ /*!********************************************!*\
  !*** external "react-icons/lib/md/person" ***!
  \********************************************/
    /*! no static exports found */
    /***/ 'react-icons/lib/md/person': function(module, exports) {
      module.exports = require('react-icons/lib/md/person')

      /***/
    },

    /***/ /*!*******************************************!*\
  !*** external "react-icons/lib/md/phone" ***!
  \*******************************************/
    /*! no static exports found */
    /***/ 'react-icons/lib/md/phone': function(module, exports) {
      module.exports = require('react-icons/lib/md/phone')

      /***/
    },

    /***/ /*!**************************************************!*\
  !*** external "react-icons/lib/md/photo-camera" ***!
  \**************************************************/
    /*! no static exports found */
    /***/ 'react-icons/lib/md/photo-camera': function(module, exports) {
      module.exports = require('react-icons/lib/md/photo-camera')

      /***/
    },

    /***/ /*!****************************************************!*\
  !*** external "react-icons/lib/md/picture-as-pdf" ***!
  \****************************************************/
    /*! no static exports found */
    /***/ 'react-icons/lib/md/picture-as-pdf': function(module, exports) {
      module.exports = require('react-icons/lib/md/picture-as-pdf')

      /***/
    },

    /***/ /*!****************************************************!*\
  !*** external "react-icons/lib/md/remove-red-eye" ***!
  \****************************************************/
    /*! no static exports found */
    /***/ 'react-icons/lib/md/remove-red-eye': function(module, exports) {
      module.exports = require('react-icons/lib/md/remove-red-eye')

      /***/
    },

    /***/ /*!********************************************!*\
  !*** external "react-icons/lib/md/search" ***!
  \********************************************/
    /*! no static exports found */
    /***/ 'react-icons/lib/md/search': function(module, exports) {
      module.exports = require('react-icons/lib/md/search')

      /***/
    },

    /***/ /*!*********************************************!*\
  !*** external "react-icons/lib/md/subject" ***!
  \*********************************************/
    /*! no static exports found */
    /***/ 'react-icons/lib/md/subject': function(module, exports) {
      module.exports = require('react-icons/lib/md/subject')

      /***/
    },

    /***/ /*!******************************************!*\
  !*** external "react-icons/lib/md/sync" ***!
  \******************************************/
    /*! no static exports found */
    /***/ 'react-icons/lib/md/sync': function(module, exports) {
      module.exports = require('react-icons/lib/md/sync')

      /***/
    },

    /***/ /*!*************************************************!*\
  !*** external "react-icons/lib/md/text-fields" ***!
  \*************************************************/
    /*! no static exports found */
    /***/ 'react-icons/lib/md/text-fields': function(module, exports) {
      module.exports = require('react-icons/lib/md/text-fields')

      /***/
    },

    /***/ /*!***********************************************!*\
  !*** external "react-icons/lib/md/transform" ***!
  \***********************************************/
    /*! no static exports found */
    /***/ 'react-icons/lib/md/transform': function(module, exports) {
      module.exports = require('react-icons/lib/md/transform')

      /***/
    },

    /***/ /*!******************************************!*\
  !*** external "react-icons/lib/md/tune" ***!
  \******************************************/
    /*! no static exports found */
    /***/ 'react-icons/lib/md/tune': function(module, exports) {
      module.exports = require('react-icons/lib/md/tune')

      /***/
    },

    /***/ /*!***********************************************!*\
  !*** external "react-icons/lib/md/view-list" ***!
  \***********************************************/
    /*! no static exports found */
    /***/ 'react-icons/lib/md/view-list': function(module, exports) {
      module.exports = require('react-icons/lib/md/view-list')

      /***/
    },

    /***/ /*!*************************************************!*\
  !*** external "react-icons/lib/md/view-module" ***!
  \*************************************************/
    /*! no static exports found */
    /***/ 'react-icons/lib/md/view-module': function(module, exports) {
      module.exports = require('react-icons/lib/md/view-module')

      /***/
    },

    /***/ /*!******************************!*\
  !*** external "react-redux" ***!
  \******************************/
    /*! no static exports found */
    /***/ 'react-redux': function(module, exports) {
      module.exports = require('react-redux')

      /***/
    },

    /***/ /*!************************!*\
  !*** external "redux" ***!
  \************************/
    /*! no static exports found */
    /***/ redux: function(module, exports) {
      module.exports = require('redux')

      /***/
    },

    /***/ /*!*************************************!*\
  !*** external "redux-first-router" ***!
  \*************************************/
    /*! no static exports found */
    /***/ 'redux-first-router': function(module, exports) {
      module.exports = require('redux-first-router')

      /***/
    },

    /***/ /*!******************************************!*\
  !*** external "redux-first-router-link" ***!
  \******************************************/
    /*! no static exports found */
    /***/ 'redux-first-router-link': function(module, exports) {
      module.exports = require('redux-first-router-link')

      /***/
    },

    /***/ /*!*****************************!*\
  !*** external "redux-saga" ***!
  \*****************************/
    /*! no static exports found */
    /***/ 'redux-saga': function(module, exports) {
      module.exports = require('redux-saga')

      /***/
    },

    /***/ /*!*************************************!*\
  !*** external "redux-saga/effects" ***!
  \*************************************/
    /*! no static exports found */
    /***/ 'redux-saga/effects': function(module, exports) {
      module.exports = require('redux-saga/effects')

      /***/
    },

    /******/
  },
)
//# sourceMappingURL=server.bundle.js.map

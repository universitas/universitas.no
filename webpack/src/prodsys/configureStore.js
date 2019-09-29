import { createStore, applyMiddleware, combineReducers } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { logger } from 'redux-logger'
import * as Sentry from '@sentry/browser'
import { connectRoutes } from 'redux-first-router'
import { compose } from 'utils/misc'
import reducers from './reducer.js'
import rootSaga from './saga.js'
import { routesMap, routerOptions, SLICE } from 'prodsys/ducks/router.js'

const configureStore = (initialState = {}, initialEntries = []) => {
  const router = connectRoutes(routesMap, {
    ...routerOptions,
    initialDispatch: false,
    initialEntries,
  })
  const sagaMiddleware = createSagaMiddleware({
    onError:
      process.env.NODE_ENV == 'production'
        ? e => Sentry.captureException(e)
        : console.error,
  })
  const warez = [sagaMiddleware, router.middleware]
  // if (process.env.NODE_ENV == 'development') warez.push(logger)

  const middlewares = compose(
    router.enhancer,
    applyMiddleware(...warez),
  )
  const rootReducer = combineReducers({ [SLICE]: router.reducer, ...reducers })
  const store = createStore(rootReducer, initialState, middlewares)
  let sagaTask = sagaMiddleware.run(rootSaga)
  router.initialDispatch() // dispatch first route after saga is started.
  if (module.hot) {
    module.hot.accept('./reducer.js', () => {
      const reducers = require('./reducer.js').default
      const newReducer = combineReducers({
        [SLICE]: router.reducer,
        ...reducers,
      })
      store.replaceReducer(newReducer)
    })
    // Hot module replacement for saga
    module.hot.accept('./saga.js', () => {
      sagaTask.cancel() // stop old saga
      sagaTask.done.then(() => {
        sagaTask = sagaMiddleware.run(require('./saga.js').default)
      })
    })
  }
  return store
}

export default configureStore

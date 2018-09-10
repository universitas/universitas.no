import { createStore, applyMiddleware, combineReducers } from 'redux'
import createSagaMiddleware from 'redux-saga'
import Raven from 'raven-js' // error logging with Sentry
import { connectRoutes } from 'redux-first-router'
import { compose } from 'utils/misc'
import reducers from './reducer.js'
import rootSaga from './saga.js'
import { routesMap, routerOptions, SLICE } from 'prodsys/ducks/router.js'

const configureStore = (initialState = {}, initialEntries = []) => {
  const router = connectRoutes(routesMap, {
    ...routerOptions,
    initialEntries,
  })
  const sagaMiddleware = createSagaMiddleware({
    onError: Raven.captureException,
  })
  const middlewares = compose(
    router.enhancer,
    applyMiddleware(sagaMiddleware, router.middleware),
  )
  const rootReducer = combineReducers({ [SLICE]: router.reducer, ...reducers })
  const store = createStore(rootReducer, initialState, middlewares)
  let sagaTask = sagaMiddleware.run(rootSaga)
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

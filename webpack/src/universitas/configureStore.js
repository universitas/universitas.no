import { createStore, applyMiddleware, combineReducers } from 'redux'
import { connectRoutes } from 'redux-first-router'
import { compose } from 'utils/misc' // use devtools if available
import createSagaMiddleware from 'redux-saga'
import reducers from './reducer.js'
import rootSaga from './saga.js'
import { routesMap, routerOptions } from 'universitas/ducks/router.js'

// creates a redux store with hot reloaded reducer and redux-saga
const configureStore = (initialState = {}, initialEntries = []) => {
  const router = connectRoutes(routesMap, {
    ...routerOptions,
    initialEntries,
  })
  const sagaMiddleware = createSagaMiddleware()
  const middlewares = compose(
    router.enhancer,
    applyMiddleware(router.middleware, sagaMiddleware),
  )
  const rootReducer = combineReducers({ location: router.reducer, ...reducers })
  const store = createStore(rootReducer, initialState, middlewares)
  // If running this on the express server, don't start saga middleware
  if (process.env.TARGET == 'server') return store
  let sagaTask = sagaMiddleware.run(rootSaga) // start sagas
  if (module.hot) {
    // Hot module replacement for reducer
    module.hot.accept('./reducer.js', () => {
      const reducers = require('./reducer.js').default
      const newReducer = combineReducers({
        location: router.reducer,
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

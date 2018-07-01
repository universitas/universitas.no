import { createStore, applyMiddleware, combineReducers } from 'redux'
import { connectRoutes } from 'redux-first-router'
import { compose } from 'utils/misc' // use devtools if available
import createSagaMiddleware from 'redux-saga'
import * as reducers from './reducers'
import rootSaga from './saga'
import { routesMap, routerOptions } from 'ducks/router'

// creates a redux store with hot reloaded reducer and redux-saga
const configureStore = (initialState = {}, initialEntries = []) => {
  const sagaMiddleware = createSagaMiddleware()
  const router = connectRoutes(routesMap, {
    ...routerOptions,
    initialEntries,
  })
  const middlewares = compose(
    router.enhancer,
    applyMiddleware(router.middleware, sagaMiddleware),
  )
  const rootReducer = combineReducers({ location: router.reducer, ...reducers })
  const store = createStore(rootReducer, initialState, middlewares)
  if (process.env.TARGET == 'server') return store
  let sagaTask = sagaMiddleware.run(rootSaga) // start sagas
  if (module.hot) {
    // Hot module replacement for reducer
    module.hot.accept('./reducers', () => {
      const reducers = require('./reducers')
      const newReducer = combineReducers({
        location: router.reducer,
        ...reducers,
      })
      store.replaceReducer(newReducer)
    })
    // Hot module replacement for saga
    module.hot.accept('./saga', () => {
      sagaTask.cancel() // stop old saga
      sagaTask.done.then(() => {
        sagaTask = sagaMiddleware.run(require('./saga').default)
      })
    })
  }
  return store
}

export default configureStore

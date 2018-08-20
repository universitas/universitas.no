import { createStore, applyMiddleware, combineReducers } from 'redux'
import createSagaMiddleware from 'redux-saga'
import {
  routerForBrowser,
  initializeCurrentLocation,
} from 'redux-little-router'
import Raven from 'raven-js'

import { compose } from 'utils/misc'
import reducers from './reducer'
import rootSaga from './saga'
import routes from './routes'

const BASENAME = '/prodsys'

export default initialState => {
  const router = routerForBrowser({ routes, basename: BASENAME })
  const sagaMiddleware = createSagaMiddleware({
    onError: Raven.captureException,
  })
  const middleware_list = [sagaMiddleware, router.middleware]
  const middlewares = compose(
    router.enhancer,
    applyMiddleware(...middleware_list),
  )
  const rootReducer = combineReducers({ ...reducers, router: router.reducer })
  const store = createStore(rootReducer, initialState, middlewares)
  let sagaTask = sagaMiddleware.run(rootSaga)
  const initialLocation = store.getState().router
  if (initialLocation) {
    store.dispatch(initializeCurrentLocation(initialLocation))
  }
  if (module.hot) {
    module.hot.accept('./reducer', () => {
      const reducers = require('./reducer').default
      const nextRootReducer = combineReducers({
        ...reducers,
        router: router.reducer,
      })
      store.replaceReducer(nextRootReducer)
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

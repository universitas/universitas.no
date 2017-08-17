import { createStore, applyMiddleware, combineReducers } from 'redux'
import createSagaMiddleware from 'redux-saga'
import {
  routerForBrowser,
  initializeCurrentLocation,
} from 'redux-little-router'

import { compose } from 'utils/misc'
import reducers from './reducer'
import rootSaga from './saga'
import routes from './routes'

const BASENAME = '/prodsys'

export default initialState => {
  const router = routerForBrowser({ routes, basename: BASENAME })
  const sagaMiddleware = createSagaMiddleware()
  const middleware_list = [sagaMiddleware, router.middleware]
  const middlewares = compose(
    router.enhancer,
    applyMiddleware(...middleware_list)
  )
  const rootReducer = combineReducers({ ...reducers, router: router.reducer })
  const store = createStore(rootReducer, initialState, middlewares)
  if (module.hot) {
    module.hot.accept('./reducer', () => {
      const reducers = require('./reducer').default
      const nextRootReducer = combineReducers({
        ...reducers,
        router: router.reducer,
      })
      store.replaceReducer(nextRootReducer)
    })
  }
  sagaMiddleware.run(rootSaga)
  const initialLocation = store.getState().router
  if (initialLocation) {
    store.dispatch(initializeCurrentLocation(initialLocation))
  }
  return store
}

import { createStore, applyMiddleware, combineReducers } from 'redux'
import createSagaMiddleware from 'redux-saga'

import { compose } from 'utils/misc'
import rootReducer from './reducer'
import rootSaga from 'sagas/frontPageSaga'

export default initialState => {
  const sagaMiddleware = createSagaMiddleware()
  const middlewares = compose(applyMiddleware(sagaMiddleware))
  const store = createStore(rootReducer, initialState, middlewares)
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducer', () => {
      const nextRootReducer = require('./reducer')
      store.replaceReducer(nextRootReducer)
    })
  }

  sagaMiddleware.run(rootSaga)
  return store
}

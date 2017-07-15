import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'

import { compose } from 'utils/misc'
import rootReducer from './reducer'
import rootSaga from './saga'

export default initialState => {
  const sagaMiddleware = createSagaMiddleware()
  const middleware_list = [sagaMiddleware]
  const middlewares = compose(applyMiddleware(...middleware_list))
  const store = createStore(rootReducer, initialState, middlewares)
  if (module.hot) {
    module.hot.accept('./reducer', () => {
      const nextRootReducer = require('./reducer').default
      store.replaceReducer(nextRootReducer)
    })
  }
  sagaMiddleware.run(rootSaga)
  return store
}

import { createStore, applyMiddleware, combineReducers } from 'redux'
import createSagaMiddleware from 'redux-saga'

import { compose } from 'utils/misc'
import reducers from './reducer'
import rootSaga from './saga'

export default initialState => {
  const sagaMiddleware = createSagaMiddleware()
  const middlewares = compose(applyMiddleware(sagaMiddleware))
  const rootReducer = combineReducers({ ...reducers })
  const store = createStore(rootReducer, initialState, middlewares)
  sagaMiddleware.run(rootSaga)
  return store
}

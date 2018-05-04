import { createStore, applyMiddleware, combineReducers } from 'redux'
import createSagaMiddleware from 'redux-saga'

import { compose } from 'utils/misc'
import reducers from './reducer'

export default initialState => {
  const rootReducer = combineReducers({ ...reducers })
  const store = createStore(rootReducer, initialState)
  return store
}

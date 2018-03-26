import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import localForage from 'localforage'
import { persistStore, persistReducer } from 'redux-persist'
import { createLogger } from 'redux-logger'

import { reducer as editor } from 'ducks/editor'

// react-dev-tools
const composeEnhancers =
  (typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose

const middleware_list = []
const defaultState = {}
const reducer = combineReducers({ editor })
const persistConfig = { key: 'primary', storage: localForage }

const configureStore = () => {
  const middleware = composeEnhancers(applyMiddleware(...middleware_list))
  const rootReducer = persistReducer(persistConfig, reducer)
  const store = createStore(rootReducer, defaultState, middleware)
  const persistor = persistStore(store)

  return { store, persistor }
}

export default configureStore

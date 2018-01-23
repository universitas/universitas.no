import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import localForage from 'localforage'
import { autoRehydrate, persistStore } from 'redux-persist'
import { createLogger } from 'redux-logger'

import { reducer as editorReducer } from 'ducks/editor'

// react-dev-tools
const composeEnhancers =
  (typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose

const middleware_list = []
const middleware = composeEnhancers(
  applyMiddleware(...middleware_list),
  autoRehydrate({ storage: localForage })
)

const defaultState = {}

const configureStore = () => {
  const rootReducer = combineReducers({ editor: editorReducer })
  const store = createStore(rootReducer, defaultState, middleware)
  persistStore(store, { storage: localForage })
  return store
}

export default configureStore

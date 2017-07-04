import { createStore, applyMiddleware, compose } from 'redux'
// import thunkMiddleware from 'redux-thunk'
import rootReducer from './reducers'
import localForage from 'localforage'
import { autoRehydrate, persistStore } from 'redux-persist'
import { createLogger } from 'redux-logger'

// react-dev-tools
const composeEnhancers =
  (typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose

const middleware_list = [createLogger()]
const middleware = composeEnhancers(
  applyMiddleware(...middleware_list),
  autoRehydrate({ storage: localForage })
)
const defaultState = {}
const store = createStore(rootReducer, defaultState, middleware)

persistStore(store, { storage: localForage })
export default store

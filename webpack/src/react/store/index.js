import { createStore, applyMiddleware, compose } from 'redux'
import { combineReducers } from 'redux-react'
import thunkMiddleware from 'redux-thunk'
import localForage from 'localforage'
import { autoRehydrate, persistStore } from 'redux-persist'
import { createLogger } from 'redux-logger'

const middlewares = [thunkMiddleware, createLogger()]
const defaultState = {}
if (process.env.NODE_ENV === 'development') {
  middlewares.push(loggerMiddleware)
}

// react-dev-tools
const composeEnhancers =
  (typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose

const configureStore = reducers => {
  const rootReducer = combineReducers(reducers)
  const middleware = composeEnhancers(
    applyMiddleware(...middlewares),
    autoRehydrate({ storage: localForage })
  )
  const store = createStore(rootReducer, defaultState, middleware)
  persistStore(store, { storage: localForage })
  return store
}
export default configureStore

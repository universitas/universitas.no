import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { apiMiddleware } from './middleware'
import localForage from 'localforage'
// import { autoRehydrate, persistStore } from 'redux-persist'

// react-dev-tools
const composeEnhancers =
  (typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose

const configureStore = (rootReducer, initialState = {}) => {
  const rootStore = createStore(
    rootReducer,
    initialState,
    composeEnhancers(
      applyMiddleware(thunkMiddleware, apiMiddleware)
      // autoRehydrate({ storage: localForage })
    )
  )
  // persistStore(rootStore, { storage: localForage })
  return rootStore
}

export default configureStore

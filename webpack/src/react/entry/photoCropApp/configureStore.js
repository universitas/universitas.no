import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import rootSaga from 'sagas/index'

// import { autoRehydrate, persistStore } from 'redux-persist'
// import localForage from 'localforage'

// react-dev-tools
const composeEnhancers =
  (typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose

const configureStore = (rootReducer, initialState = {}) => {
  const sagaMiddleware = createSagaMiddleware()
  const rootStore = createStore(
    rootReducer,
    initialState,
    composeEnhancers(
      applyMiddleware(sagaMiddleware)
      // autoRehydrate({ storage: localForage })
    )
  )
  sagaMiddleware.run(rootSaga)
  // persistStore(rootStore, { storage: localForage })
  return rootStore
}

export default configureStore

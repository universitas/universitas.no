import { createStore, applyMiddleware } from 'redux'
import { compose } from 'utils/misc' // use devtools if available
import createSagaMiddleware from 'redux-saga'
import rootReducer from './reducer'
import rootSaga from './saga'

// creates a redux store with hot reloaded reducer and redux-saga
const configureStore = (initialState = {}) => {
  const sagaMiddleware = createSagaMiddleware()
  const middlewares = compose(applyMiddleware(sagaMiddleware))
  const store = createStore(rootReducer, initialState, middlewares)
  let sagaTask = sagaMiddleware.run(rootSaga) // start sagas
  if (module.hot) {
    // Hot module replacement for reducer
    module.hot.accept('./reducer', () => {
      store.replaceReducer(require('./reducer').default)
    })
    // Hot module replacement for saga
    module.hot.accept('./saga', () => {
      sagaTask.cancel() // stop old saga
      sagaTask.done.then(() => {
        sagaTask = sagaMiddleware.run(require('./saga').default)
      })
    })
  }
  return store
}

export default configureStore

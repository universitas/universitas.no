import { createStore, applyMiddleware, combineReducers } from 'redux'
import { routerReducer, routerMiddleware } from 'react-router-redux'
import { compose } from 'utils/misc' // use devtools if available
import createSagaMiddleware from 'redux-saga'
import * as reducers from './reducers'
import rootSaga from './saga'

// creates a redux store with hot reloaded reducer and redux-saga
const configureStore = (initialState = {}, history) => {
  const sagaMiddleware = createSagaMiddleware()
  const middlewares = compose(
    applyMiddleware(routerMiddleware(history), sagaMiddleware),
  )
  const rootReducer = combineReducers({ router: routerReducer, ...reducers })
  const store = createStore(rootReducer, initialState, middlewares)
  let sagaTask = sagaMiddleware.run(rootSaga) // start sagas
  if (module.hot) {
    // Hot module replacement for reducer
    module.hot.accept('./reducers', () => {
      const reducers = require('./reducers')
      const newReducer = combineReducers({ router: routerReducer, ...reducers })
      store.replaceReducer(newReducer)
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

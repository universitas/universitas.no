import { createStore, applyMiddleware, compose } from 'redux'
// import thunkMiddleware from 'redux-thunk'
import rootReducer from './reducers'

// react-dev-tools
const composeEnhancers =
  (typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose

const defaultState = {}
const middleware_list = []
const middleware = composeEnhancers(applyMiddleware(...middleware_list))

export default createStore(rootReducer, defaultState, middleware)

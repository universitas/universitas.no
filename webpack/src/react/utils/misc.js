import * as Redux from 'redux'

export const compose = // use redux devtools if available
  (typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  Redux.compose

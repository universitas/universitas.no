/* eslint-env browser */
import React from 'react'
import { Provider } from 'react-redux'
import { combineReducers } from 'redux'

import configureStore from './configureStore'
import App from './App'
import { reducer as ui } from 'ducks/ui'
import { reducer as images } from 'ducks/images'

const rootReducer = combineReducers({ ui, images })
const rootStore = configureStore(rootReducer)

export default () => (
  <Provider store={rootStore}>
    <App />
  </Provider>
)

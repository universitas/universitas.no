import React from 'react'
import { Provider } from 'react-redux'
import configureStore from './configureStore'
import App from './App'

const rootStore = configureStore()

export default () => (
  <Provider store={rootStore}>
    <App />
  </Provider>
)

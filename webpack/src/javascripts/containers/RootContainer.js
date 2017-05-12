/* eslint-env browser */
import React from 'react'
import { App } from '../components'
import { Provider } from 'react-redux'
import { rootStore } from './store'

// const App = () => <h1>App</h1>

const Root = () => (
  <Provider store={rootStore}>
    <App />
  </Provider>
)

export default Root

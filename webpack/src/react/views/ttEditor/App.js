/* eslint-env browser */
import React from 'react'
import { Provider } from 'react-redux'
import rootStore from './store'
import Editor from './components/Editor'
import Preview from './components/Preview'
import './app.scss'

const App = () => (
  <section className="EditApp">
    <Editor />
    <Preview />
  </section>
)

export default () => (
  <Provider store={rootStore}>
    <App />
  </Provider>
)

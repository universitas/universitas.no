/* eslint-env browser */
import React from 'react'
import { Provider } from 'react-redux'
import rootStore from './store'
import Editor from './components/Editor'

export default () => <Provider store={rootStore}><Editor /></Provider>

/* eslint-env browser */
import React from 'react'
import { Provider } from 'react-redux'
import { rootStore } from './store'
import App from '../components/App'

export default () => <Provider store={rootStore}><App /></Provider>

import ReactDOM from 'react-dom'
import * as Sentry from '@sentry/browser'
import * as R from 'ramda'

import { loginFailed } from 'ducks/auth'
import { Provider } from 'react-redux'
import configureStore from './configureStore'
import App from './App'

const ROOT_ID = 'ReactApp'
const rootStore = configureStore()

// for messages insterted by django template engine
const showMessage = (msg, level) => {
  if (level == 'error') {
    console.error(msg)
    rootStore.dispatch(loginFailed({ non_field_errors: [msg] }))
  } else {
    console.log(msg)
  }
}

const ProdSys = () => (
  <Provider store={rootStore}>
    <App />
  </Provider>
)

const render = DOMNode => {
  window.showMessage = showMessage
  if (process.env.SENTRY_URL) Sentry.init({ dsn: process.env.SENTRY_URL })
  ReactDOM.render(<ProdSys />, DOMNode)
}

const DOMNode = document.getElementById(ROOT_ID)
if (DOMNode) render(DOMNode)
else
  console.error(`Could not mount React App, because  #${ROOT_ID} was not found`)

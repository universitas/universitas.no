import 'babel-polyfill'
import ReactDOM from 'react-dom'
import Raven from 'raven-js'
import { loginFailed } from 'ducks/auth'
import ProdSys, { rootStore } from './ProdSys'

const SENTRY_URL = 'https://39de0aa2b6b3440da82c9f41ef232d39@sentry.io/51254'
const ROOT_ID = 'ReactApp'
const DOMNode = document.getElementById(ROOT_ID)

const showMessage = (msg, level) => {
  if (level == 'error') {
    console.error(msg)
    rootStore.dispatch(loginFailed({ non_field_errors: [msg] }))
  } else {
    console.log(msg)
  }
}

const render = () => {
  window.showMessage = showMessage
  Raven.config(SENTRY_URL).install()
  Raven.context(() => ReactDOM.render(<ProdSys />, DOMNode))
}

if (DOMNode) {
  render()
} else {
  console.log(`Could not mount React App, because  #${ROOT_ID} was not found`)
}

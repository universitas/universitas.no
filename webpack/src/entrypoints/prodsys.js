import 'babel-polyfill'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import ProdSys, { rootStore } from './ProdSys'
import { loginFailed } from 'ducks/auth'
import Raven from 'raven-js'

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
  const app = (
    <AppContainer>
      <ProdSys />
    </AppContainer>
  )
  Raven.config(SENTRY_URL).install()
  Raven.context(() => ReactDOM.render(app, DOMNode))
}

if (DOMNode) {
  render()
  module.hot && module.hot.accept('./ProdSys', render)
} else {
  console.log(`Could not mount React App, because  #${ROOT_ID} was not found`)
}

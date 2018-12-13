import ReactDOM from 'react-dom'
import Raven from 'raven-js'
import { loginFailed } from 'ducks/auth'
import { Provider } from 'react-redux'
import configureStore from './configureStore'
import App from './App'

const SENTRY_URL = 'https://39de0aa2b6b3440da82c9f41ef232d39@sentry.io/51254'
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
  const renderApp = () => ReactDOM.render(<ProdSys />, DOMNode)
  if (process.env.NODE_ENV == 'production') {
    Raven.config(SENTRY_URL).install()
    Raven.context(renderApp)
  } else renderApp()
}

const DOMNode = document.getElementById(ROOT_ID)
if (DOMNode) render(DOMNode)
else
  console.error(`Could not mount React App, because  #${ROOT_ID} was not found`)

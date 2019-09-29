// frontpage of universitas.no react app
import ReactDOM from 'react-dom'
import * as Sentry from '@sentry/browser'
import { Provider } from 'react-redux'
import configureStore from './configureStore'
import App from './App'

const ROOT_ID = 'ReactApp'
const JSON_ID = 'redux-state'

const Universitas = initialState => (
  <Provider store={configureStore(initialState)}>
    <App />
  </Provider>
)

const rehydrate = (state, node) => {
  // rehydrate with error fallback

  if (!window.URLSearchParams) return // don't support internet explorer
  const html = node.innerHtml
  const user = state && state.auth && state.auth.id
  delete window.__RENDER_ERROR__
  if (process.env.SENTRY_URL) Sentry.init({ dsn: process.env.SENTRY_URL })
  try {
    // throw 'fooo'
    ReactDOM.hydrate(Universitas(state), node)
    if (window.__RENDER_ERROR__) throw new Error(window.__RENDER_ERROR__)
  } catch (e) {
    console.error(e)
    if (!user && html) node.innerHtml = html
  }
}

const render = (rootNode, initialState = null) =>
  initialState
    ? rehydrate(initialState, rootNode)
    : ReactDOM.render(Universitas(), rootNode)

const stateJson = document.getElementById(JSON_ID)
const initialState = stateJson ? JSON.parse(stateJson.textContent) : null

const MountNode = document.getElementById(ROOT_ID)
if (MountNode) render(MountNode, initialState)
else console.error(`#${ROOT_ID} was not found`)

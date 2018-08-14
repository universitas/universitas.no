// frontpage of universitas.no react app
import 'babel-polyfill'
import ReactDOM from 'react-dom'
import Universitas from './Universitas'

const ROOT_ID = 'ReactApp'
const JSON_ID = 'redux-state'

const rehydrate = (state, node) => {
  // rehydrate with error fallback
  const html = node.innerHtml
  const user = state && state.auth && state.auth.id
  try {
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

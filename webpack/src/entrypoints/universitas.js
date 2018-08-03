// frontpage of universitas.no react app
import 'babel-polyfill'
import ReactDOM from 'react-dom'
import Universitas from './Universitas'

const ROOT_ID = 'ReactApp'
const JSON_ID = 'redux-state'

const render = (rootNode, initialState = null) =>
  initialState
    ? ReactDOM.hydrate(Universitas(initialState), rootNode)
    : ReactDOM.render(Universitas(), rootNode)

const stateJson = document.getElementById(JSON_ID)
const initialState = stateJson ? JSON.parse(stateJson.textContent) : null

const MountNode = document.getElementById(ROOT_ID)
if (MountNode) render(MountNode, initialState)
else console.error(`#${ROOT_ID} was not found`)

// frontpage of universitas.no react app
import 'babel-polyfill'
import ReactDOM from 'react-dom'
import Universitas from './Universitas'

const ROOT_ID = 'ReactApp'

const render = (rootNode, initialState = null) =>
  initialState
    ? ReactDOM.hydrate(Universitas(initialState), rootNode)
    : ReactDOM.render(Universitas(), rootNode)

const DOMNode = document.getElementById(ROOT_ID)
if (DOMNode) render(DOMNode, window.__REDUX_STATE__)
else console.error(`#${ROOT_ID} was not found`)

// frontpage of universitas.no react app
import 'babel-polyfill'
import ReactDOM from 'react-dom'
import Universitas from './Universitas'

const ROOT_ID = 'ReactApp'
const DOMNode = document.getElementById(ROOT_ID)

const render = () => {
  ReactDOM.render(<Universitas />, DOMNode)
}

if (DOMNode) {
  render()
} else {
  console.error(`Could not mount React App, because  #${ROOT_ID} was not found`)
}

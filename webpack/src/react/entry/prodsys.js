import 'babel-polyfill'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import ProdSys, { rootStore } from './ProdSys'
import { loginFailed } from 'ducks/auth'

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
  ReactDOM.render(
    <AppContainer>
      <ProdSys />
    </AppContainer>,
    DOMNode
  )
}

if (DOMNode) {
  render()
  module.hot && module.hot.accept('./ProdSys', render)
} else {
  console.log(`Could not mount React App, because  #${ROOT_ID} was not found`)
}

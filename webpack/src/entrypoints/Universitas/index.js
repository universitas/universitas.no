import { Provider } from 'react-redux'
import App from './App'
import configureStore from './configureStore'

export default () => (
  <Provider store={configureStore()}>
    <App />
  </Provider>
)

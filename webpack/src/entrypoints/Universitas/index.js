import { Provider } from 'react-redux'
import configureStore from './configureStore'
import App from './App'

export default () => (
  <Provider store={configureStore()}>
    <App />
  </Provider>
)

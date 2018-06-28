import { Provider } from 'react-redux'
import App from './App'
import configureStore from './configureStore'

export default initialState => (
  <Provider store={configureStore(initialState)}>
    <App />
  </Provider>
)

import { Provider } from 'react-redux'
import App from './App'
import configureStore from './configureStore'
import createHistory from 'history/createBrowserHistory'

const history = createHistory({ basename: '/dev' })
const store = configureStore({}, history)

export default () => (
  <Provider store={store}>
    <App />
  </Provider>
)

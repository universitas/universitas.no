import { Provider } from 'react-redux'
import App from './App'
import configureStore from './configureStore'
import createHistory from 'history/createBrowserHistory'
import { ConnectedRouter } from 'react-router-redux'

const history = createHistory({ basename: '/dev' })
const store = configureStore({}, history)

export default () => (
  <Provider store={configureStore()}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>
)

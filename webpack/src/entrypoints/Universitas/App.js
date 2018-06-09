import { hot } from 'react-hot-loader'
import 'styles/universitas.scss'
import Menu from './components/Menu'
import Page from './components/Page'

const App = ({}) => (
  <div className="Universitas">
    <Menu />
    <Page />
  </div>
)

export default hot(module)(App)

import { hot } from 'react-hot-loader'
import 'styles/universitas.scss'
import TopMenu from 'components/TopMenu'
import PageSwitch from 'components/PageSwitch'

const App = ({}) => (
  <div className="Universitas">
    <TopMenu />
    <PageSwitch />
  </div>
)

export default hot(module)(App)

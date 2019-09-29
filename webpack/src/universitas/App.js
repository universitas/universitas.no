import { hot } from 'react-hot-loader'
import TopMenu from 'components/TopMenu'
import PageSwitch from 'components/PageSwitch'
import FrontpageEdit from 'components/FrontpageEdit'
import SentryBoundary from 'components/SentryBoundary'
import './styles/universitas.scss'

const App = ({}) => (
  <div className="Universitas">
    <TopMenu />
    <SentryBoundary>
      <PageSwitch />
    </SentryBoundary>
    <FrontpageEdit />
  </div>
)

export default hot(module)(App)

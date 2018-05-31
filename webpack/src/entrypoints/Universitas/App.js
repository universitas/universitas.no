import { hot } from 'react-hot-loader'
import 'styles/universitas.scss'
import Menu from './components/Menu'
import NewsFeed from './components/NewsFeed'

const App = ({}) => (
  <div className="Universitas">
    <Menu />
    <NewsFeed />
  </div>
)

export default hot(module)(App)

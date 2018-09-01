import { connect } from 'react-redux'
import { getUser } from 'ducks/auth'
import { hot } from 'react-hot-loader'
import LoginForm from 'components/LoginForm'
import ProdSys from './ProdSys.js'

import 'components/NewsFeed/NewsFeed.scss'
import 'styles/universitas.scss'
import 'styles/prodsys.scss'

const App = ({ username, pending }) =>
  pending ? null : username ? <ProdSys /> : <LoginForm />

export default hot(module)(connect(getUser)(App))

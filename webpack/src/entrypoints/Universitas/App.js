import { connect } from 'react-redux'
import NewsFeed from './components/NewsFeed'
import 'styles/universitas.scss'

const Menu = ({ sections }) => <section className="Menu">Top menu</section>

const App = ({}) => (
  <div className="Universitas">
    <Menu />
    <NewsFeed />
  </div>
)

const mapStateToProps = (state, ownProps) => ({})
const mapDispatchToProps = (dispatch, ownProps) => ({})
export default connect(mapStateToProps, mapDispatchToProps)(App)

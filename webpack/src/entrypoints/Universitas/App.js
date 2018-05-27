import { connect } from 'react-redux'
import 'styles/universitas.scss'
import NewsFeed from './components/NewsFeed'

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

import { connect } from 'react-redux'
import 'styles/universitas.scss'

const Menu = ({ sections }) => <section className="Menu">Top menu</section>
const NewsFeed = ({ sections }) => (
  <section className="NewsFeed">News feed</section>
)

const App = ({}) => (
  <div className="Universitas">
    <Menu />
    <NewsFeed />
  </div>
)

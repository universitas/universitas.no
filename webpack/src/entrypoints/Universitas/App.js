import { hot } from 'react-hot-loader'
import 'styles/universitas.scss'
import Menu from './components/Menu'
import NewsFeed from './components/NewsFeed'
import { Route, Switch } from 'react-router-dom'
import { withErrorBoundary } from 'react-error-boundary'

const PdfPage = ({}) => (
  <section className="PdfPage">
    <h1>PDF</h1>
  </section>
)

const Story = ({ match, slug }) => (
  <article className="Story">
    <h1>Sak #{JSON.stringify(match.params)}</h1>
    {slug && <p>slug: </p>}
  </article>
)

const NotFound = ({}) => <div className="NotFound">not found</div>

const Feed = withErrorBoundary(NewsFeed)

const App = ({}) => (
  <div className="Universitas">
    <Menu />
    <Switch>
      <Route exact path="/pdf/" component={PdfPage} />
      <Route exact path="/" component={Feed} />
      <Route path="/seksjon/:section/" component={Feed} />
      <Route path="/sak/:id(\d+)/:slug?/" component={Story} />
      <Route component={NotFound} />
    </Switch>
  </div>
)

export default hot(module)(App)

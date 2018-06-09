import { withErrorBoundary } from 'react-error-boundary'
import { connect } from 'react-redux'
import NewsFeed from './NewsFeed'
import SearchFeed from './SearchFeed'
import { HOME, SECTION, STORY, PDF, getPage } from 'ducks/router'
import { getSearch } from 'ducks/newsFeed'

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

const pages = {
  [HOME]: NewsFeed,
  [SECTION]: NewsFeed,
  [STORY]: Story,
  [PDF]: PdfPage,
}

const Page = ({ page, search }) => {
  const Component = withErrorBoundary(
    search ? SearchFeed : pages[page] || NotFound
  )
  return <Component />
}

export default connect(R.applySpec({ page: getPage, search: getSearch }))(Page)

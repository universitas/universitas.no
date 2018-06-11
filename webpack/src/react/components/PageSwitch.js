import { withErrorBoundary } from 'react-error-boundary'
import { connect } from 'react-redux'
import { HOME, SECTION, STORY, SHORT_URL, PDF, getLocation } from 'ducks/router'
import { getSearch } from 'ducks/newsFeed'
import { NewsFeed, SearchFeed } from 'components/NewsFeed'
import StoryPage from 'components/Story'

const PdfPage = ({}) => (
  <section className="PdfPage">
    <h1>PDF</h1>
  </section>
)

const NotFound = ({}) => <div className="NotFound">not found</div>

const pages = {
  [HOME]: NewsFeed,
  [SECTION]: NewsFeed,
  [STORY]: StoryPage,
  [SHORT_URL]: StoryPage,
  [PDF]: PdfPage,
}

const getPage = ({ type }) => pages[type] || NotFound

const PageSwitch = ({ location, search }) => {
  const Component = withErrorBoundary(search ? SearchFeed : getPage(location))
  return (
    <main className="Page">
      <Component {...location.payload} pathname={location.pathname} />
    </main>
  )
}

export default connect(
  R.applySpec({ location: getLocation, search: getSearch }),
)(PageSwitch)

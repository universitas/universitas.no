import { connect } from 'react-redux'
import { getFeed, feedRequested } from 'ducks/newsFeed'
import { getLanguage } from 'ducks/menu'
import LoadMore from 'components/LoadMore'
import cx from 'classnames'
import './NewsFeed.scss'
import ErrorBoundary from 'react-error-boundary'
import FeedItem from './FeedItem.js'

const Loading = connect(getFeed, { feedRequested })(LoadMore)

const sectionNames = {
  Nyheter: 1,
  Magasin: 2,
  Kultur: 3,
  Debatt: 4,
  Baksiden: 5,
}

const Feed = ({ results = [], language, ...props }) => {
  const sectionId = R.pipe(
    R.pathOr(null, ['match', 'params', 'section']),
    R.propOr(null, R.__, sectionNames),
  )(props)

  const isSection = sectionId
    ? R.filter(R.propEq('section', sectionId))
    : R.identity

  const isLanguage = language
    ? R.filter(R.propEq('language', language))
    : R.identity

  const stories = R.into([], R.compose(isSection, isLanguage), results)
  const offset = stories.length ? R.last(stories).order : null
  return (
    <section className="NewsFeed">
      {stories.map(props => <FeedItem key={props.id} {...props} />)}
      <Loading offset={offset} section={sectionId} />
    </section>
  )
}

const combineSelectors = R.unapply(R.converge(R.unapply(R.mergeAll)))

const mapStateToProps = combineSelectors(getFeed, getLanguage)
export default connect(mapStateToProps)(Feed)

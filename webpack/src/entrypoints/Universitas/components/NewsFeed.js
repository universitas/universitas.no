import { connect } from 'react-redux'
import { getItems, getFeed, feedRequested } from 'ducks/newsFeed'
import LoadMore from 'components/LoadMore'
import FeedItem from './FeedItem.js'
import './NewsFeed.scss'

export const Feed = ({ items = [], fetching, next, feedRequested }) => {
  const offset = items.length ? R.last(items).order : null
  const fetchMore = () => feedRequested({ offset })
  return (
    <section className="NewsFeed">
      {items.map(props => <FeedItem key={props.id} {...props} />)}
      <LoadMore fetchMore={fetchMore} fetching={fetching} next={next} />
    </section>
  )
}

export default connect(s => ({ items: getItems(s), ...getFeed(s) }), {
  feedRequested,
})(Feed)

import { connect } from 'react-redux'
import cx from 'classnames'
import { timeoutDebounce, inViewPort } from 'utils/misc'
import { getItems, getFeed, feedRequested } from 'ducks/newsFeed'
import { getStory, storiesRequested } from 'ducks/publicstory'
import LoadMore from 'components/LoadMore'
import Advert from 'components/Advert'
import FeedItem from './FeedItem'

const mapItemStateToProps = (state, { story, addRef }) => {
  const fullStory = getStory(story.id)(state)
  if (!fullStory) return { _ref: addRef, fetchStatus: 'unfetched' }
  addRef(null)
  return { fetchStatus: fullStory.fetching ? 'fetching' : 'fetched' }
}
const ConnectedFeedItem = connect(mapItemStateToProps)(FeedItem)

class NewsFeed extends React.Component {
  constructor(props) {
    super(props)
    this.itemRefs = {}
    this.addRef = id => el => (this.itemRefs[id] = el)
    this.addHandler = () => {
      this.scrollHandler = timeoutDebounce(ev => this.feedScrolled(), 500)
    }
    this.addHandler()
  }

  feedScrolled() {
    const itemsVisible = R.pipe(
      R.without(R.isNil),
      R.filter(inViewPort),
      R.keys,
    )(this.itemRefs)
    if (R.isEmpty(itemsVisible)) return
    if (this.props.storiesRequested) this.props.storiesRequested(itemsVisible)
  }

  componentDidMount() {
    if (module.hot) this.addHandler()
    window.addEventListener('scroll', this.scrollHandler, {
      capture: true,
      passive: true,
    })
    this.scrollHandler()
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollHandler)
  }
  componentDidUpdate() {
    if (module.hot) this.addHandler()
    this.scrollHandler()
  }

  render() {
    const {
      items,
      fetching,
      next,
      feedRequested,
      className,
      section,
    } = this.props
    const offset = items.length ? R.last(items).order : null
    const fetchMore = () => feedRequested({ offset })

    const insertIfLongEnough = R.curry((index, item) =>
      R.when(R.pipe(R.length, R.lte(index)), R.insert(index, item)),
    )
    const feed = R.pipe(
      R.map(props => (
        <ConnectedFeedItem
          addRef={this.addRef(props.story.id)}
          key={props.id}
          {...props}
        />
      )),
      insertIfLongEnough(5, <Qmedia key="qm" />),
      insertIfLongEnough(20, <Adwords key={`${section}-1`} />),
      insertIfLongEnough(35, <Adwords key={`${section}-2`} />),
      insertIfLongEnough(50, <Adwords key={`${section}-3`} />),
      R.append(
        <LoadMore
          key="loader"
          fetchMore={fetchMore}
          fetching={fetching}
          next={next}
        />,
      ),
    )(items)

    return <section className={cx('NewsFeed', className)}>{feed}</section>
  }
}

const Qmedia = key => (
  <Advert.Qmedia key={`qmedia ${key}`} className="col-6 row-2" />
)
const Adwords = key => (
  <Advert.Google key={`adwords ${key}`} className="col-6 row-1" />
)

export { NewsFeed }

export default connect(s => ({ items: getItems(s), ...getFeed(s) }), {
  feedRequested,
  storiesRequested,
})(NewsFeed)

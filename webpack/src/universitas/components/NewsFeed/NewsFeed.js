import { connect } from 'react-redux'
import cx from 'classnames'
import { timeoutDebounce, isVisible, inViewPort } from 'utils/misc'
import { getItems, getFeed, feedRequested } from 'ducks/newsFeed'
import { getStory, storiesRequested } from 'ducks/publicstory'
import Advert from 'components/Advert'
import FeedItem from './FeedItem.js'
import PlaceHolder from './PlaceHolder.js'

const mapItemStateToProps = (state, { story }) => {
  const fullStory = getStory(story.id)(state)
  const fetchStatus = fullStory
    ? fullStory.fetching ? 'fetching' : 'fetched'
    : 'unfetched'
  return { fetchStatus }
}
const ConnectedFeedItem = connect(mapItemStateToProps)(FeedItem)

const standardizeSize = ({ rows, columns, ...props }) => ({
  rows: [1, 2, 2, 2, 4, 4, 6][rows],
  columns: [0, 2, 2, 2, 2, 4, 4][columns],
  ...props,
})

const mapFrom = R.curry((index, fn, list) => {
  const [head, tail] = R.splitAt(index, list)
  return R.concat(head, R.map(fn, tail))
})

class NewsFeed extends React.Component {
  static defaultProps = {
    debounce: 500,
    storiesRequested: (...args) => console.warn('storiesRequested', args),
  }
  constructor(props) {
    super(props)
    this.redLine = 0 // where to fetch more stuff
    this.itemRefs = {}
    this.addRef = id => el => el && (this.itemRefs[id] = el)
    this.scrollHandler = this.scrollHandler.bind(this)
    this.getRedLine = this.getRedLine.bind(this)
    this.fetchVisibleStories = this.fetchVisibleStories.bind(this)
    this.timeout = null
    this.fetchMore = () => {
      const { items, feedRequested } = this.props
      const offset = items.length ? R.last(items).order : null
      feedRequested({ offset })
    }
  }

  fetchVisibleStories() {
    R.pipe(
      R.prop('itemRefs'),
      R.filter(inViewPort),
      R.keys,
      R.unless(R.isEmpty, this.props.storiesRequested),
    )(this)
  }

  getRedLine() {
    return R.pipe(
      R.prop('itemRefs'),
      R.pluck('offsetTop'),
      R.values,
      R.filter(R.identity),
      R.sort(R.subtract),
      R.slice(-4, Infinity),
      R.head,
      R.defaultTo(0),
    )(this)
  }

  scrollHandler() {
    const { debounce = 500, fetching, next } = this.props
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.fetchVisibleStories()
    }, debounce)
    const scroll = window.scrollY + window.innerHeight
    if (!next || fetching) return
    if (scroll > this.redLine) {
      this.fetchMore()
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.scrollHandler)
    this.redLine = this.getRedLine()
    this.scrollHandler()
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollHandler)
  }
  componentDidUpdate() {
    this.redLine = this.getRedLine()
    this.scrollHandler()
  }

  render() {
    const { items, next, className, section } = this.props

    const insertIfLongEnough = R.curry((index, item) =>
      R.when(R.pipe(R.length, R.lte(index)), R.insert(index, item)),
    )
    const scrollSpies = (values = [4, 4, 2, 2, 2, 2, 2, 2]) =>
      values.map((n, idx) => (
        <PlaceHolder key={`ph-${idx}`} className={`col-${n} row-${n}`} />
      ))
    const feed = R.pipe(
      mapFrom(section ? 0 : 20, standardizeSize),
      R.when(
        R.pipe(R.length, R.lt(8)),
        mapFrom(-4, R.mergeDeepLeft({ columns: 2, rows: 2 })),
      ),
      R.map(props => (
        <FeedItem
          _ref={this.addRef(props.story.id)}
          key={props.id}
          {...props}
        />
      )),
      insertIfLongEnough(5, <Qmedia key="qm" />),
      insertIfLongEnough(20, <Adwords key={`${section}-1`} />),
      insertIfLongEnough(35, <Adwords key={`${section}-2`} />),
      insertIfLongEnough(50, <Adwords key={`${section}-3`} />),
      R.when(R.always(this.props.fetching), R.concat(R.__, scrollSpies())),
      R.unless(
        R.always(this.props.next),
        R.append(<FeedTerminator key="terminator" />),
      ),
    )(items)

    return <section className={cx('NewsFeed', className)}>{feed}</section>
  }
}
const RedLine = ({ offset }) =>
  offset ? (
    <hr
      style={{
        position: 'absolute',
        top: `${offset}px`,
        borderTop: '10em solid red',
        opacity: '0.5',
        width: '100%',
        transition: 'top 2s ease',
      }}
    />
  ) : null

const FeedTerminator = () => (
  <div className="FeedTerminator">Ingen flere saker</div>
)

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

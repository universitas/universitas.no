import { connect } from 'react-redux'
import cx from 'classnames'
import { timeoutDebounce, isVisible, inViewPort } from 'utils/misc'
import { getItems, getFeed, feedRequested } from 'ducks/newsFeed'
import { getStory, storiesRequested } from 'ducks/publicstory'
import Advert from 'components/Advert'
import FeedItem from './FeedItem.js'
import PlaceHolder from './PlaceHolder.js'
import './NewsFeed.scss'

import banner from '../../images/universitas_mars.jpg';

// Standard grid sizes for below the fold feed items.
// This makes dense css grid much less likely to have voids
const standardizeGridItemSize = ({ size: [columns, rows], ...props }) => ({
  size: [[0, 2, 2, 2, 2, 4, 4][columns], [0, 1, 2, 2, 4, 4, 4][rows]],
  ...props,
})

// Map only over items from `index` to the end of the sequence
const mapFrom = R.curry((index, fn, list) => {
  const [head, tail] = R.splitAt(index, list)
  return R.concat(head, R.map(fn, tail))
})

class NewsFeed extends React.Component {
  static defaultProps = {
    prefetchDebounce: 500, // milliseconds before prefetching stories
    storiesPrefetch: (...args) => console.warn('storiesPrefetch', args),
  }
  constructor(props) {
    super(props)
    this.timeout = null
    this.redLine = 0 // where to fetch more stuff
    this.itemRefs = {}
    this.addRef = id => el => el && (this.itemRefs[id] = el)

    this.scrollHandler = this.scrollHandler.bind(this)

    this.getRedLine = () =>
      R.pipe(
        R.prop('itemRefs'),
        R.pluck('offsetTop'),
        R.values,
        R.filter(R.identity),
        R.sort(R.subtract),
        R.slice(-4, Infinity),
        R.head,
        R.defaultTo(0),
      )(this)

    this.prefetchStories = () =>
      R.pipe(
        R.prop('itemRefs'),
        R.filter(inViewPort),
        R.keys, // story id
        R.map(parseInt), // id should be integer
        R.unless(R.isEmpty, this.props.storiesPrefetch),
      )(this)

    this.fetchNewsFeed = () => {
      const { items, feedRequested } = this.props
      const offset = items.length ? Math.floor(R.last(items).ranking) : null
      feedRequested({ offset })
    }
  }

  scrollHandler() {
    const { prefetchDebounce = 500, fetching, next } = this.props
    // prefetch full stories?
    clearTimeout(this.timeout)
    this.timeout = setTimeout(this.prefetchStories, prefetchDebounce)

    // fetch more of the news feed?
    if (!next || fetching) return
    if (window.scrollY + window.innerHeight > this.redLine) this.fetchNewsFeed()
  }

  componentDidMount() {
    window.addEventListener('scroll', this.scrollHandler)
    this.redLine = this.getRedLine()
    this.scrollHandler()
  }

  componentDidUpdate() {
    this.redLine = this.getRedLine()
    this.scrollHandler()
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollHandler)
  }

  render() {
    const { items, next, className, section } = this.props

    const ads = [
      <Advert.Qmedia key={`qmedia ${section}`} className="col-6 row-2" />,
      <Advert.Qmedia key={`qmedia 1 ${section}`} className="col-6 row-2" />,
      <Advert.Qmedia key={`qmedia 2 ${section}`} className="col-6 row-2" />,
      <Advert.Qmedia key={`qmedia 3 ${section}`} className="col-6 row-2" />,
    ]

    const renderFeed = R.pipe(
      // Use complete item size customization for "above the fold" items only
      mapFrom(section ? 0 : 21, standardizeGridItemSize),
      // last four stories should be small, and serve as scroll spies
      R.when(
        R.pipe(R.length, R.lt(8)),
        mapFrom(-4, R.mergeDeepLeft({ size: [2, 2] })),
      ),
      // render feed items
      R.map(props => (
        <FeedItem
          key={props.id}
          addRef={this.addRef}
          sectionName={props.story.section}
          {...props}
        />
      )),
      // add adverts
      addAdverts(ads),
      // append placeholders if fetching
      R.when(
        R.always(this.props.fetching),
        R.flip(R.concat)(renderPlaceholders([4, 4, 2, 2, 2, 2, 2])),
      ),
      // append feed terminator if the api is exhausted
      R.unless(
        R.always(this.props.next),
        R.append(<FeedTerminator key="terminator" />),
      ),
    )

    function TopBanner(props) {
      if(props.src === null) {
        return null;
      }
      return (
        <div className="col-6" style={{ textAlign: 'center' }}>
          <p style={{ margin: '0', fontSize: '11px', color: 'gray' }}>
            annonse
          </p>
          <a href={props.url}>
            <img
              className="col-6"
              src={props.src}
              //style={{ border: '0px solid grey' }}
            />
          </a>
        </div>
      )
    }

    return (
      //Toppbanner
      <section className={cx('NewsFeed', className)}>
        <TopBanner
          url="https://www.akademika.no/butikker/akademika-blindern?utm_source=Universitas&utm_medium=banner&utm_campaign=v_21​"
          src={banner}
        />
        {renderFeed(items)}
      </section>
    )
  }
}

const renderPlaceholders = sizes =>
  sizes.map((n, idx) => (
    <PlaceHolder key={`ph-${idx}`} className={`col-${n} row-${n}`} />
  ))

const insertIfLongEnough = R.curry((index, item) =>
  R.when(R.pipe(R.length, R.lte(index)), R.insert(index, item)),
)

export const addAdverts = (ads = ads) =>
  R.pipe(
    //insertIfLongEnough(4, ads[1]),
    insertIfLongEnough(5, ads[0]),
    insertIfLongEnough(10, ads[2]),
    insertIfLongEnough(30, ads[3]),
    insertIfLongEnough(50, ads[4]),
  )

const FeedTerminator = () => (
  <div className="FeedTerminator">Ingen flere saker</div>
)

export { NewsFeed }

export default connect(s => ({ items: getItems(s), ...getFeed(s) }), {
  feedRequested,
  storiesPrefetch: storiesRequested,
})(NewsFeed)

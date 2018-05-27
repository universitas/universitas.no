import { connect } from 'react-redux'
import { getFeed, feedRequested } from 'ducks/newsFeed'
import cx from 'classnames'
import './NewsFeed.scss'

class Loading extends React.Component {
  componentDidMount() {
    console.log('mounted')
    this.props.fetch()
  }

  render() {
    const { fetching } = this.props
    return <div className="Loading"> loading {fetching ? '...' : '–'} </div>
  }
}

const withChildren = Component => props =>
  props.children ? <Component {...props} /> : null

const Vignette = withChildren(({ children, section }) => (
  <div className={cx('Vignette', `section-${section}`)}>{children}</div>
))
const Headline = withChildren(({ href, children }) => (
  <h1 className="Headline">
    <a href={href}>{children}</a>
  </h1>
))
const Kicker = withChildren(({ children }) => (
  <h3 className="Kicker">{children}</h3>
))
const Lede = withChildren(({ children }) => <p className="Lede">{children}</p>)

const position = ({ x = 0.5, y = 0.5 }) => `${x * 100}% ${y * 100}%`

const FeedImage = ({ href, image, crop_box }) =>
  image ? (
    <a
      href={href}
      title={href}
      className="FeedImage"
      style={{
        backgroundRepeat: 'none',
        backgroundImage: `url(${image})`,
        backgroundPosition: position(crop_box),
        backgroundSize: 'cover',
        height: '100%',
      }}
    />
  ) : null

const FeedItem = ({
  headline,
  vignette,
  kicker,
  lede,
  story_url,
  columns,
  section,
  rows,
  image,
  crop_box,
  html_class,
  order,
}) => {
  const className = cx('FeedItem', `col-${columns}`, `row-${rows}`, html_class)
  const title = `${order} ${className}`
  return (
    <article className={className} title={title}>
      <FeedImage href={story_url} image={image} crop_box={crop_box} />
      <Vignette section={section}>{vignette}</Vignette>
      <div className="text">
        <Kicker>{kicker}</Kicker>
        <Headline href={story_url}>{headline}</Headline>
        <Lede>{lede}</Lede>
      </div>
    </article>
  )
}
const FetchMore = ({ fetch, fetching }) => (
  <div className="FetchMore" onClick={fetch}>
    {fetching ? 'fetching' : 'fetch more stories'}
  </div>
)

const Feed = ({ fetching, feedRequested, results, next }) => {
  const fetch = () => feedRequested({ offset: R.last(results).order })
  return (
    <section className="NewsFeed">
      {results.map(props => <FeedItem key={props.id} {...props} />)}
      <FetchMore fetch={fetch} fetching={fetching} />
    </section>
  )
}

const NewsFeed = props => {
  const { fetching, feedRequested, ...other } = props
  return R.isEmpty(other) ? (
    <Loading {...props} fetch={feedRequested} />
  ) : (
    <Feed {...props} />
  )
}

const mapStateToProps = state => getFeed(state)
const mapDispatchToProps = { feedRequested }
export default connect(mapStateToProps, mapDispatchToProps)(NewsFeed)

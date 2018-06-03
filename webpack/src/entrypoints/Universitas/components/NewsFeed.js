import { connect } from 'react-redux'
import { getFeed, feedRequested } from 'ducks/newsFeed'
import LoadMore from 'components/LoadMore'
import cx from 'classnames'
import './NewsFeed.scss'
import ErrorBoundary from 'react-error-boundary'

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
      <ErrorBoundary>
        <FeedImage href={story_url} image={image} crop_box={crop_box} />
        <Vignette section={section}>{vignette}</Vignette>
        <Kicker>{kicker}</Kicker>
        <Headline href={story_url}>{headline}</Headline>

        <Lede>{lede}</Lede>
      </ErrorBoundary>
    </article>
  )
}

const Loading = connect(getFeed, { feedRequested })(LoadMore)

const Feed = ({ results = [] }) => {
  const offset = results.length ? R.last(results).order : null
  return (
    <section className="NewsFeed">
      {results.map(props => <FeedItem key={props.id} {...props} />)}
      <Loading offset={offset} />
    </section>
  )
}

export default connect(getFeed)(Feed)

import cx from 'classnames'
import ErrorBoundary from 'react-error-boundary'
import Link from 'redux-first-router-link'
import { toStory } from 'ducks/router'
import { hyphenate } from 'utils/text'

const position = ({ x = 0.5, y = 0.5 }) => `${x * 100}% ${y * 100}%`

const ifChildren = Component => props =>
  props.children ? <Component {...props} /> : null

const Vignette = ifChildren(({ children, section }) => (
  <div className={cx('Vignette', `section-${section}`)}>{children}</div>
))
const Headline = ifChildren(({ children }) => (
  <h1 className="Headline">{children}</h1>
))
const Kicker = ifChildren(({ children }) => (
  <h3 className="Kicker">{children}</h3>
))
const Lede = ifChildren(({ children }) => <p className="Lede">{children}</p>)

const FeedImage = ({ image, crop_box }) =>
  image ? (
    <div
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
  columns,
  section,
  rows,
  image,
  crop_box,
  html_class,
  language,
  order,
  story,
}) => {
  const className = cx('FeedItem', `col-${columns}`, `row-${rows}`, html_class)
  const title = `${order} ${className}`
  return (
    <Link to={toStory(story)} className={className}>
      <ErrorBoundary>
        <FeedImage image={image} crop_box={crop_box} />
        <Vignette section={section}>{vignette}</Vignette>
        <Kicker>{hyphenate(kicker)}</Kicker>
        <Headline>{hyphenate(headline)}</Headline>
        <Lede>{lede}</Lede>
      </ErrorBoundary>
    </Link>
  )
}

export default FeedItem

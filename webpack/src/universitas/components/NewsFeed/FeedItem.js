import cx from 'classnames'
import ErrorBoundary from 'react-error-boundary'
import Link from 'redux-first-router-link'
import { Done, Sync, Clear } from 'components/Icons'
import { toStory } from 'universitas/ducks/router'
import { hyphenate, slugify } from 'utils/text'
import { renderStyles, parseStyles } from './feedItemStyles.js'
import { inlineText } from 'markup/render.js'
import FeedImage from './FeedImage.js'
import './NewsFeed.scss'

const ifChildren = Component => props =>
  props.children ? <Component {...props} /> : null

const Vignette = ifChildren(({ children, sectionName }) => (
  <div className="Vignette">
    <div className="bg-section">{children}</div>
  </div>
))
const Headline = ifChildren(({ children }) => (
  <h1 className="Headline">{children}</h1>
))
const Kicker = ifChildren(({ children }) => (
  <h3 className="Kicker">{children}</h3>
))
const Lede = ifChildren(({ children }) => <p className="Lede">{children}</p>)

const Div = props => <div {...props} />

export const FeedItem = ({
  html_class,
  size: [columns, rows] = [2, 2],
  imagefile,
  headline,
  vignette,
  kicker,
  lede,
  crop_box,
  sectionName = '',
  className,
  Wrapper = Div,
  ...props
}) => (
  <Wrapper
    className={cx(
      className,
      'FeedItem',
      `col-${columns}`,
      `row-${rows}`,
      `section-${slugify(sectionName)}`,
      renderStyles(parseStyles(html_class)),
    )}
    {...props}
  >
    {imagefile && (
      <FeedImage
        imagefile={imagefile}
        crop_box={crop_box}
        moduleSize={
          R.contains('layout-left', html_class)
            ? [columns / 3, rows]
            : [columns, rows]
        }
      />
    )}
    <div className="gradient" />
    <Vignette>{inlineText(vignette)}</Vignette>
    <Kicker>{inlineText(hyphenate(kicker))}</Kicker>
    <Headline>{inlineText(hyphenate(headline))}</Headline>
    <Lede>{inlineText(lede)}</Lede>
  </Wrapper>
)

const LinkWrapper = ({ fetchStatus, story, addRef, children, className }) => {
  return (
    <Link to={toStory(story)} className={className}>
      <ErrorBoundary>
        {addRef && <div style={{ gridArea: '1/1' }} ref={addRef(story.id)} />}
        {children}
      </ErrorBoundary>
    </Link>
  )
}

const GridField = ({ col, row }) => (
  <div
    className="GridField"
    style={{
      gridColumnStart: col + 1,
      gridRowStart: row + 1,
    }}
  />
)

export const StoryBookGrid = ({ children, ...props }) => (
  <section className="StoryBookGrid" {...props}>
    {children}
    {R.range(0, 36).map(n => (
      <GridField key={n} col={n % 6} row={Math.floor(n / 6)} />
    ))}
  </section>
)

export default props => <FeedItem Wrapper={LinkWrapper} {...props} />

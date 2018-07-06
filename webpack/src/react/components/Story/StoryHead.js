import StoryImage from './StoryImage.js'
import SlideShow from 'components/SlideShow'
import { hyphenate, cleanText } from 'utils/text'
import cx from 'classnames'

const ifChildren = Component => props =>
  props.children ? <Component {...props} /> : null

const Vignette = ifChildren(({ section, ...props }) => (
  <div className={cx('Vignette', `section-${section}`)} {...props} />
))
const Headline = ifChildren(props => <h1 className="Headline" {...props} />)
const Kicker = ifChildren(props => <h3 className="Kicker" {...props} />)
const Lede = ifChildren(props => <p className="Lede" {...props} />)

const headImages = R.pipe(
  R.prop('images'),
  R.filter(R.pathEq(['placement'], 'head')),
)

const StoryHead = ({ title, kicker, lede, ...props }) => {
  const images = headImages(props)
  const autoCrop = images.length ? images[0]['aspect_ratio'] == 0 : false

  return (
    <div className={cx('StoryHead')}>
      {images.length ? (
        <div className={cx('mainImage', { autoCrop })}>
          <SlideShow>
            {images.map((props, idx) => <StoryImage key={idx} {...props} />)}
          </SlideShow>
        </div>
      ) : null}
      <Kicker>{cleanText(kicker)}</Kicker>
      <Headline>{cleanText(hyphenate(title))}</Headline>
      <Lede>{cleanText(lede)}</Lede>
    </div>
  )
}

export default StoryHead

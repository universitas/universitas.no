import StoryImage from './StoryImage.js'
import SlideShow from 'components/SlideShow'
import { cleanText } from 'utils/text'
const ifChildren = Component => props =>
  props.children ? <Component {...props} /> : null

const Vignette = ifChildren(({ section, ...props }) => (
  <div className={cx('Vignette', `section-${section}`)} {...props} />
))
const Headline = ifChildren(props => <h1 className="Headline" {...props} />)
const Kicker = ifChildren(props => <h3 className="Kicker" {...props} />)
const Lede = ifChildren(props => <p className="Lede" {...props} />)

const images = R.pipe(
  R.prop('images'),
  R.filter(R.pathEq(['placement'], 'head')),
)

const StoryHead = ({ title, kicker, lede, ...props }) => {
  const mainImage = images(props).map((props, idx) => (
    <StoryImage key={idx} {...props} />
  ))
  return (
    <div className="StoryHead">
      {mainImage.length ? (
        <div className="mainImage">
          <SlideShow>{mainImage}</SlideShow>
        </div>
      ) : null}
      <Kicker>{cleanText(kicker)}</Kicker>
      <Headline>{cleanText(title)}</Headline>
      <Lede>{cleanText(lede)}</Lede>
    </div>
  )
}

export default StoryHead

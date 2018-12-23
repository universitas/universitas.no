import StoryImage from './StoryImage.js'
import SlideShow from 'components/SlideShow'
import { hyphenate } from 'utils/text'
import { inlineText } from 'markup/render'
import cx from 'classnames'

const ifChildren = Component => ({ children, ...props }) =>
  children ? <Component {...props}>{inlineText(children)}</Component> : null

const Vignette = ifChildren(({ section, ...props }) => (
  <div className={cx('Vignette', `section-${section}`)} {...props} />
))
const Headline = ifChildren(props => <h1 className="Headline" {...props} />)
const Kicker = ifChildren(props => <h3 className="Kicker" {...props} />)
const Lede = ifChildren(props => <p className="Lede" {...props} />)

const StoryHead = ({
  title = '( ingen tittel )',
  kicker,
  lede,
  images = [],
}) => {
  const headImages = R.pipe(
    R.filter(R.propEq('placement', 'head')),
    R.sort(R.ascend(R.prop('ordering'))),
  )(images)

  // const autoCrop = false
  const autoCrop = headImages.length
    ? parseFloat(headImages[0]['aspect_ratio']) === 0
    : false

  return (
    <header className={cx('StoryHead', { noImage: headImages.length == 0 })}>
      {headImages.length ? (
        <div className={cx('mainImage', { autoCrop })}>
          <SlideShow>
            {headImages.map((props, idx) => (
              <StoryImage key={idx} {...props} />
            ))}
          </SlideShow>
        </div>
      ) : null}
      <Kicker>{kicker}</Kicker>
      <Headline>{hyphenate(title)}</Headline>
      <Lede>{lede}</Lede>
    </header>
  )
}

export default React.memo(StoryHead)

import './StoryImage.scss'
import fallbackImage from 'common/images/placeholder.svg'
import { inlineText } from 'markup/render'

export const Caption = ({ children, creditline = '' }) => {
  const caption = R.cond([
    [R.is(String), R.identity],
    [R.is(Array), R.head],
    [R.T, R.toString],
  ])(children)
  if (!(caption || creditline)) return null
  const match = R.match(/^([^:.\n]*[:!?])(.*)$/, caption)
  const [, intro, body = caption] = match
  return (
    <div className="Caption">
      {intro && <span className="stikk">{inlineText(intro)} </span>}
      {inlineText(body)}
      {creditline && <span className="creditline">{creditline}</span>}
    </div>
  )
}

const imageStyle = ({ category, crop_box: { x = 0.5, y = 0.5 } }) => ({
  objectPosition: category == 'diagram' ? 'center' : `${x * 100}% ${y * 100}%`,
})

const Image = ({
  id,
  cropped,
  large = fallbackImage,
  aspect_ratio,
  caption,
  crop_box = {},
  category,
}) =>
  id ? (
    <div className="imgWrapper">
      <img
        className={category}
        style={imageStyle({ crop_box, category })}
        src={category == 'diagram' ? large : cropped || large}
        alt={caption}
      />
    </div>
  ) : null

const StoryImage = ({ caption, creditline, ...props }) => (
  <div className="StoryImage">
    <Image caption={caption} {...props} />
    <Caption creditline={creditline}>{caption}</Caption>
  </div>
)

export default StoryImage

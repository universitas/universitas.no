import './StoryImage.scss'
import fallbackImage from 'common/images/placeholder.svg'
import { inlineText } from 'markup/render'

const Caption = ({ caption = '', creditline = '' }) => {
  if (!(caption || creditline)) return null
  const match = R.match(/^([^:.\n]*:)(.*)$/, caption) || [, '', caption]
  const [, intro, body] = match
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

const StoryImage = props => (
  <div className="StoryImage">
    <Image {...props} />
    <Caption {...props} />
  </div>
)

export default StoryImage

import './StoryImage.scss'

const position = ({ x = 0.5, y = 0.5 }) => `${x * 100}% ${y * 100}%`

const Caption = ({ caption, creditline }) => {
  if (!(caption || creditline)) return null
  const match = R.match(/^([^:.\n]*:)(.*)$/, caption)
  let intro = ''
  if (match) {
    intro = match[1]
    caption = match[2]
  }

  return (
    <div className="Caption">
      {intro && <strong className="stikk">{intro}</strong>}
      {caption}
      {creditline && <span className="creditline">{creditline}</span>}
    </div>
  )
}

const Image = ({
  id,
  cropped,
  large,
  aspect_ratio,
  caption,
  crop_box = {},
  category,
}) =>
  id ? (
    <div className="imgWrapper">
      <img
        className={category}
        style={{
          objectPosition: position(crop_box),
        }}
        src={cropped || large}
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

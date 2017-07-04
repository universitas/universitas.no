import PropTypes from 'prop-types'
import React from 'react'
import { getStyles } from './utils'

let PreviewImg = ({ src, crop_box, size, aspect, style = {} }) => {
  const styles = getStyles(src, crop_box, size[0] / size[1], aspect)
  const items = {
    position: styles.backgroundPosition,
    size: styles.backgroundSize,
    'aspect ratio': aspect,
  }
  return (
    <div className="PreviewImg" style={style}>
      <svg style={styles} viewBox={`0 0 ${aspect} 1`} />
    </div>
  )
}
PreviewImg.propTypes = {
  src: PropTypes.string.isRequired,
  size: PropTypes.array.isRequired,
  crop_box: PropTypes.object.isRequired,
  aspect: PropTypes.number.isRequired,
  style: PropTypes.object,
}

const Previews = ({ image, src, aspects = [2], flexDirection = 'row' }) => (
  <div className="Previews" style={{ flexDirection }}>
    {aspects.map((aspect, i) => (
      <PreviewImg
        key={i}
        aspect={aspect}
        style={{ flex: flexDirection === 'row' ? aspect : 1 / aspect }}
        src={src}
        {...image}
      />
    ))}
  </div>
)
Previews.propTypes = {
  aspects: PropTypes.array,
  flexDirection: PropTypes.string,
  image: PropTypes.object,
}

export { Previews }

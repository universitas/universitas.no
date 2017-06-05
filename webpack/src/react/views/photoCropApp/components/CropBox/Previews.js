import PropTypes from 'prop-types'
import React from 'react'
import { normalize } from './reducers'

const closeCrop = (x, y, l, r, t, b, A) => {
  const w = r - l
  const h = b - t
  const a = w / h
  const W = 0.5 * Math.min(A, 1, a > A ? w : h * A)
  const H = W / A
  const [X, Y] = [
    W * 2 > w ? [W, (l + r) / 2, 1 - W] : [l + W, x, r - W],
    H * 2 > h ? [H, (t + b) / 2, 1 - H] : [t + H, y, b - H],
  ].map(arr => arr.sort((n, m) => n - m)[1])

  return { left: X - W, right: X + W, top: Y - H, bottom: Y + H }
}

const getStyles = (src, crop_box, imgRatio, frameRatio) => {
  const { left, top, right, bottom } = closeCrop(
    crop_box.x,
    crop_box.y,
    crop_box.left,
    crop_box.right,
    crop_box.top,
    crop_box.bottom,
    frameRatio / imgRatio
  )
  const width = right - left
  const height = bottom - top
  const ratioOf = (low, val, high) =>
    high === low ? 0.5 : (val - low) / (high - low)
  const numberToPercent = number => `${(100 * number).toFixed(1)}%`
  return {
    backgroundImage: `url(${src})`,
    backgroundPosition: [[width, right, 1], [height, bottom, 1]]
      .map(dim => ratioOf(...dim))
      .map(numberToPercent)
      .join(' '),
    backgroundRepeat: 'no-repeat',
    backgroundSize: `${numberToPercent(1 / width)} auto`,
  }
}

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

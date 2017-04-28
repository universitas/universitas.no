import React from 'react'
import { connect } from 'react-redux'
import { normalize } from './reducers'
import { InfoBox } from './CropInfo'
import './preview.scss'


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

const getStyles = (src, crop, imgRatio, frameRatio) => {
  const h = normalize(crop.h)
  const v = normalize(crop.v)
  const { left, top, right, bottom } = closeCrop(
    h[1], v[1], h[0], h[2], v[0], v[2], frameRatio / imgRatio)
  const width = right - left
  const height = bottom - top
  const ratioOf = (low, val, high) => ((high === low) ? 0.5 : ((val - low) / (high - low)))
  const numberToPercent = number => `${(100 * number).toFixed(1)}%`
  return {
    backgroundImage: `url(${src})`,
    backgroundPosition: [[width, right, 1], [height, bottom, 1]]
    .map(dim => ratioOf(...dim)).map(numberToPercent).join(' '),
    backgroundRepeat: 'no-repeat',
    backgroundSize: `${numberToPercent(1 / width)} auto`,
  }
}

let PreviewImg = ({ src, crop, size, aspect, style = {} }) => {
  const styles = getStyles(src, crop, size[0] / size[1], aspect)
  const items = {
    position: styles.backgroundPosition,
    size: styles.backgroundSize,
    "aspect ratio": aspect,
  }
  return (
    <div className="previewWrapper infoParent" style={style} >
      <svg
        className="previewImg"
        style={styles}
        viewBox={`0 0 ${aspect} 1`}
      />
      <InfoBox items={items} />
    </div>
  )
}
PreviewImg.propTypes = {
  src: React.PropTypes.string.isRequired,
  size: React.PropTypes.array.isRequired,
  crop: React.PropTypes.object.isRequired,
  aspect: React.PropTypes.number.isRequired,
  style: React.PropTypes.object,
}
const mapStateToProps = (state, { src }) => state.images[src]
PreviewImg = connect(mapStateToProps)(PreviewImg)

const Previews = ({ src, aspects = [2], flexDirection }) => (
  <div
    className="previewPanel"
    style={{ flexDirection }}
  >
    {
      aspects.map((aspect, i) => (
        <PreviewImg
          key={i}
          aspect={aspect}
          src={src}
          style={{ flex: flexDirection === 'row' ? aspect : 1 / aspect }}
        />))
    }
  </div>
)
Previews.propTypes = {
  src: React.PropTypes.string,
  aspects: React.PropTypes.array,
  flexDirection: React.PropTypes.string,
}

export { Previews, PreviewImg }

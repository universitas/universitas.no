import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { Overlay, DragKing } from './Overlay'

class CropBox extends React.Component {
  getRelativePosition = e => {
    const img = this.masterImg.getBoundingClientRect()
    const trunc = num => Math.max(0, Math.min(num, 1))
    return [
      (e.clientX - img.left) / img.width,
      (e.clientY - img.top) / img.height,
    ].map(trunc)
  }
  render() {
    const { id, src, size, crop_box, pending, dragging } = this.props
    const [width, height] = size || [100, 100]
    return (
      <div className="CropBox">
        <svg
          height="100%"
          preserveAspectRatio="xMidYMin"
          viewBox={`0 0 ${width} ${height}`}
        >
          <image
            className="masterImg"
            xlinkHref={src}
            ref={img => (this.masterImg = img)}
            width="100%"
            height="100%"
          />
          <Overlay
            id={id}
            crop_box={crop_box}
            size={size}
            pending={pending}
            getRelativePosition={this.getRelativePosition}
          />
        </svg>
        <DragKing
          id={id}
          getRelativePosition={this.getRelativePosition}
          isActive={Boolean(dragging.dragMask)}
        />
      </div>
    )
  }
}
CropBox.propTypes = {
  id: PropTypes.number.isRequired,
  src: PropTypes.string.isRequired,
  size: PropTypes.array.isRequired,
  crop_box: PropTypes.object.isRequired,
  dragging: PropTypes.object.isRequired,
  pending: PropTypes.bool.isRequired,
}

export { CropBox }

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
    const { id, src, size, dragging, cropping_method } = this.props
    const [width, height] = size || [100, 100]
    const pending = cropping_method === 1
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
  aspects: PropTypes.array,
  size: PropTypes.array,
  dragging: PropTypes.object,
}

export { CropBox }

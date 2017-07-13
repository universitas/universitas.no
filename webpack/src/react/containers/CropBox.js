import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import {
  endDragHandle,
  moveDragHandle,
  startDragHandle,
  startNewCrop,
  setCenter,
} from 'ducks/cropWidget'
import Overlay from 'components/Overlay'
import DragKing from 'components/DragKing'
import './cropbox.scss'

class CropBox extends React.Component {
  getRelativePosition = e => {
    const img = this.masterImg.getBoundingClientRect()
    const trunc = num => Math.max(0, Math.min(num, 1))
    return [
      (e.clientX - img.left) / img.width,
      (e.clientY - img.top) / img.height,
    ].map(trunc)
  }
  startNewCrop = e => this.props.startNewCrop(this.getRelativePosition(e))
  moveDragHandle = e => this.props.moveDragHandle(this.getRelativePosition(e))
  endDragHandle = e => this.props.endDragHandle()
  startDragHandleFactory = dragMask => e =>
    this.props.startDragHandleFactory(dragMask, this.getRelativePosition(e))

  render() {
    const { src, size, crop_box, pending, dragging } = this.props
    const [width, height] = size || [100, 100]
    const dragKing = dragging.dragMask === undefined
      ? null
      : <DragKing
          moveDragHandle={this.moveDragHandle}
          endDragHandle={this.endDragHandle}
        />

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
            crop_box={crop_box}
            size={size}
            pending={pending}
            startNewCrop={this.startNewCrop}
            startDragHandleFactory={this.startDragHandleFactory}
          />
        </svg>
        {dragKing}
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
  startNewCrop: PropTypes.func.isRequired,
  startDragHandleFactory: PropTypes.func.isRequired,
  moveDragHandle: PropTypes.func.isRequired,
  endDragHandle: PropTypes.func.isRequired,
  // setCenter: PropTypes.func.isRequired,
}

const mapDispatchToProps = (dispatch, { id }) => ({
  startNewCrop: pos => dispatch(startNewCrop(id, pos)),
  startDragHandleFactory: (dragMask, pos) =>
    dispatch(startDragHandle(id, pos, dragMask)),
  moveDragHandle: pos => dispatch(moveDragHandle(id, pos)),
  endDragHandle: () => dispatch(endDragHandle(id)),
  // setCenter: pos => dispatch(setCenter(id, pos)),
})

export default connect(null, mapDispatchToProps)(CropBox)

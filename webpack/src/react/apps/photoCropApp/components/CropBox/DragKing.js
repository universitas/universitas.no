import PropTypes from 'prop-types'
import React from 'react'

const DragKing = ({ moveDragHandle, endDragHandle }) => (
  <div
    className="DragKing"
    onMouseUp={endDragHandle}
    onMouseLeave={endDragHandle}
    onMouseMove={moveDragHandle}
  />
)

DragKing.propTypes = {
  moveDragHandle: PropTypes.func.isRequired,
  endDragHandle: PropTypes.func.isRequired,
}

export default DragKing

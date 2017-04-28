import React from 'react'
import { connect } from 'react-redux'
import * as actions from './actions'
import { normalize } from './reducers'
import { Feature, Symbols } from './Features'
import './overlay.scss'


const DragKing = (props) => (
  <div
    className="dragKing"
    {...props}
  />
)

/* eslint-disable quote-props */
const cursor = {
  '1000': 'ew-resize',
  '0010': 'ew-resize',
  '0100': 'ns-resize',
  '0001': 'ns-resize',
  '1100': 'nw-resize',
  '0110': 'ne-resize',
  '0011': 'se-resize',
  '1001': 'sw-resize',
}
/* eslint-enable quote-props */

const Handle = ({ name, mouseDownHandler }) => {
  const handleSize = 0.1
  const mask = name.split('').map(parseFloat)
  return (
    <rect
      className={name}
      onMouseDown={mouseDownHandler(mask)}
      width={1 - mask[0] - mask[2] + handleSize}
      height={1 - mask[1] - mask[3] + handleSize}
      x={mask[2] - handleSize / 2}
      y={mask[3] - handleSize / 2}
      style={{ cursor: cursor[name] }}
    />
  )
}
Handle.propTypes = {
  name: React.PropTypes.string,
  mouseDownHandler: React.PropTypes.func,
}

let Overlay = ({
  size,
  getRelativePosition,
  crop,
  dragging,
  startDragHandle,
  startNewCrop,
  setCenter,
  moveDragHandle,
  endDragHandle,
  interactive,
  features,
}) => {
  const [left, x, right] = normalize(crop.h)
  const [top, y, bottom] = normalize(crop.v)
  const boxPath = `M${left}, ${top}V${bottom}H${right}V${top}Z`
  const outerPath = 'M0, 0H1V1H0Z'
  const circleRadius = (rx) => ({ rx, ry: rx * size[0] / size[1] || rx })

  const mouseDownHandler = (dragMask) => (e) => startDragHandle(getRelativePosition(e), dragMask)
  const mouseMove = (e) => moveDragHandle(getRelativePosition(e))
  const newCrop = (e) => startNewCrop(getRelativePosition(e))
  const moveCenter = (e) => setCenter(getRelativePosition(e))

  return (
    <div className="overlayWrapper">
      <svg
        className={`overlay${interactive ? '' : ' inactive'}`}
        viewBox="0 0 1 1"
        preserveAspectRatio="none"
        height="100%"
        width="100%"
      >
        {features && <Symbols />}
        <path
          className="outside"
          fillRule="evenodd"
          d={outerPath + boxPath}
          onMouseDown={newCrop}
        />
        <g className="inside" >
          <path
            onMouseDown={mouseDownHandler([1, 1, 1, 1, 0])}
            onClick={moveCenter}
            className="box"
            d={boxPath}
          />
          <svg
            className="handles"
            viewBox="0 0 1 1"
            preserveAspectRatio="none"
            height={bottom - top}
            width={right - left}
            x={left}
            y={top}
          >
            {['1000', '0100', '0010', '0001', '1100', '0110', '0011', '1001'].map(name => (
              <Handle key={name} name={name} mouseDownHandler={mouseDownHandler} />
            ))}
          </svg>
        </g>
        <g className="centerPoint">
          <ellipse
            className="handle"
            style={{ opacity: 0 }}
            onMouseDown={mouseDownHandler([0, 0, 0, 0, 1])}
            cx={x} cy={y} {...circleRadius(0.05)}
          />
          <path className="cross" d={`M0, ${y}H1M${x}, 0V1`} />
        </g>
        {features.map((f, i) => <Feature key={i} {...f} />)}
      </svg>
      {dragging.dragMask && <DragKing
        onMouseMove={mouseMove}
        onMouseUp={endDragHandle}
        onMouseLeave={endDragHandle}
      />}
    </div>
  )
}

Overlay.propTypes = {
  size: React.PropTypes.array,
  crop: React.PropTypes.object.isRequired,
  dragging: React.PropTypes.object,
  getRelativePosition: React.PropTypes.func.isRequired,
  startDragHandle: React.PropTypes.func.isRequired,
  moveDragHandle: React.PropTypes.func.isRequired,
  endDragHandle: React.PropTypes.func.isRequired,
  setCenter: React.PropTypes.func.isRequired,
  startNewCrop: React.PropTypes.func.isRequired,
  interactive: React.PropTypes.bool.isRequired,
  features: React.PropTypes.array.isRequired,
}

const mapStateToProps = (state, { src }) => state.images[src]

const mapDispatchToProps = (dispatch, { src }) => ({
  setCenter: (position) => {
    dispatch(actions.setCenter(src, position))
  },
  startNewCrop: (position) => {
    dispatch(actions.startNewCrop(src, position))
  },
  startDragHandle: (position, dragMask) => {
    dispatch(actions.startDragHandle(src, position, dragMask))
  },
  moveDragHandle: (position) => {
    dispatch(actions.moveDragHandle(src, position))
  },
  endDragHandle: () => {
    dispatch(actions.endDragHandle(src))
  },
})

Overlay = connect(mapStateToProps, mapDispatchToProps)(Overlay)
export { Overlay }

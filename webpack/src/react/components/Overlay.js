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

const Handle = ({ name, startDragHandleFactory }) => {
  const handleSize = 0.1
  const mask = name.split('').map(parseFloat)
  return (
    <rect
      onMouseDown={startDragHandleFactory(mask)}
      width={1 - mask[0] - mask[2] + handleSize}
      height={1 - mask[1] - mask[3] + handleSize}
      x={mask[2] - handleSize / 2}
      y={mask[3] - handleSize / 2}
      style={{ cursor: cursor[name] }}
    />
  )
}
Handle.propTypes = {
  name: PropTypes.string,
  startDragHandleFactory: PropTypes.func,
}

const Overlay = ({
  size,
  pending,
  crop_box,
  startDragHandleFactory,
  startNewCrop,
}) => {
  const { left, x, right, top, y, bottom } = crop_box
  const boxPath = `M${left}, ${top}V${bottom}H${right}V${top}Z`
  const outerPath = 'M0, 0H1V1H0Z'
  const circleRadius = rx => ({ rx, ry: rx * size[0] / size[1] || rx })
  const startMoveCropBox = startDragHandleFactory([1, 1, 1, 1, 0])
  const startMoveCenter = startDragHandleFactory([0, 0, 0, 0, 1])

  return (
    <svg>
      <svg
        className="Overlay"
        viewBox="0 0 1 1"
        preserveAspectRatio="none"
        height="100%"
        width="100%"
      >
        <path
          className="outside"
          fillRule="evenodd"
          d={outerPath + boxPath}
          onMouseDown={startNewCrop}
        />
        <g className={`inside${pending ? ' pending' : ''}`}>
          <path onMouseDown={startMoveCropBox} className="box" d={boxPath} />
          <svg
            className="handles"
            viewBox="0 0 1 1"
            preserveAspectRatio="none"
            height={bottom - top}
            width={right - left}
            x={left}
            y={top}
          >
            {[
              '1000',
              '0100',
              '0010',
              '0001',
              '1100',
              '0110',
              '0011',
              '1001',
            ].map(name => (
              <Handle
                key={name}
                name={name}
                startDragHandleFactory={startDragHandleFactory}
              />
            ))}
          </svg>
        </g>
        <g className="centerPoint">
          <ellipse
            className="handle"
            style={{ opacity: 0 }}
            onMouseDown={startMoveCenter}
            cx={x}
            cy={y}
            {...circleRadius(0.05)}
          />
          <path className="cross" d={`M0, ${y}H1M${x}, 0V1`} />
        </g>
      </svg>
    </svg>
  )
}

Overlay.propTypes = {
  size: PropTypes.array.isRequired,
  crop_box: PropTypes.object.isRequired,
  pending: PropTypes.bool.isRequired,
  startDragHandleFactory: PropTypes.func.isRequired,
  startNewCrop: PropTypes.func.isRequired,
}

export default Overlay

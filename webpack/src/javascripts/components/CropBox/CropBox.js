import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { setImgSize } from './actions'
import { Overlay, DragKing } from './Overlay'

class CropBox extends React.Component {
  constructor(props) {
    super(props)
    this.imgOnLoad = this.imgOnLoad.bind(this)
    this.getRelativePosition = this.getRelativePosition.bind(this)
    this.masterImg = null
  }
  getRelativePosition(e) {
    const img = this.masterImg.getBoundingClientRect()
    const trunc = num => Math.max(0, Math.min(num, 1))
    return [
      (e.clientX - img.left) / img.width,
      (e.clientY - img.top) / img.height,
    ].map(trunc)
  }
  imgOnLoad(e) {
    const img = e.target
    this.props.setImgSize([img.offsetWidth, img.offsetHeight])
  }
  render() {
    const { id, src, size, dragging } = this.props
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
            onLoad={this.imgOnLoad}
            width="100%"
            height="100%"
          />
          <Overlay getRelativePosition={this.getRelativePosition} id={id} />
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
  setImgSize: PropTypes.func.isRequired,
}

const mapDispatchToProps = (dispatch, { id }) => ({
  setImgSize: size => dispatch(setImgSize(id, size)),
})
CropBox = connect(null, mapDispatchToProps)(CropBox)

export { CropBox }

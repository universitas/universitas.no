import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { setImgSize } from './actions'
import { Previews } from './Preview'
import { Overlay } from './Overlay'
import { CropInfo } from './CropInfo'
import './cropbox.scss'


class Canvas extends React.Component {
  constructor(props) {
    super(props)
    this.imgOnLoad = this.imgOnLoad.bind(this)
    this.getRelativePosition = this.getRelativePosition.bind(this)
  }
  getRelativePosition(e) {
    const img = this.refs.masterImg.getBoundingClientRect()
    return [
      (e.clientX - img.left) / img.width,
      (e.clientY - img.top) / img.height,
    ].map(num => Math.max(0, Math.min(num, 1)))
  }
  imgOnLoad(e) {
    const img = e.target
    this.props.setImgSize([img.offsetWidth, img.offsetHeight])
  }
  render() {
    const horizontal = false
    const { id, src, interactive, features, showPreviews } = this.props
    const direction = horizontal ? ['row', 'column'] : ['column', 'row']
    const aspects = horizontal ? [0.6, 2] : [1, 0.5, 2.5]
    return (
      <div
        className="cropboxWrapper"
        style={{ flexDirection: direction[0], display: 'flex' }}
      >
        <div
          className="masterImgWrapper infoParent"
        >
          <img
            ref="masterImg"
            className="masterImg"
            onLoad={this.imgOnLoad}
            src={src}
          />
          <Overlay
            getRelativePosition={this.getRelativePosition}
            id={id}
            features={features}
            interactive={interactive}
          />
          <CropInfo id={id} />
        </div>
        {showPreviews &&
          <Previews
            id={id}
            aspects={aspects}
            flexDirection={direction[1]}
          />
        }
      </div>
    )
  }
}
Canvas.propTypes = {
  id: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  aspects: PropTypes.array,
  imageSize: PropTypes.array,
  setImgSize: PropTypes.func.isRequired,
  interactive: PropTypes.bool.isRequired,
  features: PropTypes.array.isRequired,
  showPreviews: PropTypes.bool.isRequired,
}
Canvas.defaultProps = {
  interactive: true,
  showPreviews: true,
  features: [],
}

const mapDispatchToProps = (dispatch, {id}) => ({
  setImgSize: size => dispatch(setImgSize(id, size)),
})
const mapStateToProps = (state, {id}) => ({src: state.images[id].src})
const CropBox = connect(mapStateToProps, mapDispatchToProps)(Canvas)

export { CropBox }

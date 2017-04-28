import React from 'react'
import { connect } from 'react-redux'
import { setImgSize, addImage } from './actions'
import { Previews } from './Preview'
import { Overlay } from './Overlay'
import { CropInfo } from './CropInfo'
import './cropbox.scss'


class Canvas extends React.Component {
  constructor(props) {
    super(props)
    props.addImage()
    this.imgOnLoad = this.imgOnLoad.bind(this)
    this.getRelativePosition = this.getRelativePosition.bind(this)
    if (props.imageSize !== undefined) {
      this.props.setImgSize(props.imageSize)
    }
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
    const { src, interactive, features, showPreviews } = this.props
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
            src={src}
            features={features}
            interactive={interactive}
          />
          <CropInfo src={src} />
        </div>
        {showPreviews &&
          <Previews
            src={src}
            aspects={aspects}
            flexDirection={direction[1]}
          />
        }
      </div>
    )
  }
}
Canvas.propTypes = {
  src: React.PropTypes.string.isRequired,
  aspects: React.PropTypes.array,
  imageSize: React.PropTypes.array,
  setImgSize: React.PropTypes.func.isRequired,
  addImage: React.PropTypes.func.isRequired,
  interactive: React.PropTypes.bool.isRequired,
  features: React.PropTypes.array.isRequired,
  showPreviews: React.PropTypes.bool.isRequired,
}
Canvas.defaultProps = {
  interactive: true,
  showPreviews: true,
  features: [],
}
const defaultCrop = { h: [0.1, 0.5, 0.9], v: [0.1, 0.5, 0.9] }

const mapDispatchToProps = (dispatch, { src, crop = defaultCrop }) => ({
  setImgSize: size => dispatch(setImgSize(src, size)),
  addImage: () => dispatch(addImage(src, crop)),
})
const CropBox = connect(null, mapDispatchToProps)(Canvas)

export { CropBox }

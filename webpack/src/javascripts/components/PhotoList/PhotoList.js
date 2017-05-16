import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { updateSearch, fetchImages } from './actions'
import { selectImage } from '../EditImage/actions'
import './photolist.scss'

const FullThumbWithCropBox = ({ small, title, size, crop_box }) => {
  const { left, x, right, top, y, bottom } = crop_box
  const [width, height] = size
  const boxPath = `M0, 0H1V1H0Z M${left}, ${top}V${bottom}H${right}V${top}Z`
  return (
    <svg className="Thumb" viewBox={`0 0 ${width} ${height}`}>
      <image xlinkHref={small} width="100%" height="100%" />
      <svg
        viewBox="0 0 1 1"
        preserveAspectRatio="none"
        height="100%"
        width="100%"
      >
        <path className="cropOverlay" fillRule="evenodd" d={boxPath} />

      </svg>
      <Frame />
    </svg>
  )
}

const FullThumb = ({ small, title, size }) => (
  <svg className="Thumb" viewBox={`0 0 ${size[0]} ${size[1]}`}>
    <image xlinkHref={small} width="100%" height="100%" />
    <Frame />
  </svg>
)

const CroppedThumb = ({ thumb, title }) => (
  <svg className="Thumb" viewBox={'0 0 1 1'}>
    <image xlinkHref={thumb} height="100%" />
    <Frame />
  </svg>
)

const Frame = () => <rect className="Frame" width="100%" height="100%" />
const thumbStyles = [CroppedThumb, FullThumbWithCropBox, FullThumb]

let Photo = ({ onClick, filename, thumbStyle = 0, ...props }) => {
  const Thumb = thumbStyles[thumbStyle]
  return (
    <div className="Photo" onClick={onClick}>
      <Thumb {...props} />
      <small className="title">
        {filename.replace(/^.*\//, '')}
      </small>
    </div>
  )
}
const mapImageStatetoProps = ({ searchField, images }, { id }) => ({
  thumbStyle: searchField.thumbStyle,
  ...images[id],
})

const mapImageDispatchToProps = (dispatch, { id }) => ({
  onClick: e => dispatch(selectImage(id)),
})

Photo = connect(mapImageStatetoProps, mapImageDispatchToProps)(Photo)

const List = ({ images, style = {} }) => (
  <section className="PhotoList" style={style}>
    {images.map(img => <Photo key={img} id={img} />)}
  </section>
)

const mapImageListStateToProps = ({ searchField }) => ({
  images: searchField.images,
})

const PhotoList = connect(mapImageListStateToProps)(List)

export { PhotoList }

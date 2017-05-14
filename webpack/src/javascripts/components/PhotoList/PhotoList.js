import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { updateSearch, fetchImages } from './actions'
import { selectImage } from '../EditImage/actions'
import './photolist.scss'

const Thumb = ({ src, onClick, title }) => (
  <div className="Thumb" onClick={onClick}>
    <img className="preview" src={src} title={title} />
    <small className="title">{title.replace(/^.*\//, '')}</small>
  </div>
)
const mapThumbStateToProps = ({ images }, { id }) => ({
  src: images[id].preview,
  title: images[id].source_file,
})
const mapThumbDispatchToProps = (dispatch, { id }) => ({
  onClick: e => dispatch(selectImage(id)),
})

const ImageThumb = connect(mapThumbStateToProps, mapThumbDispatchToProps)(Thumb)

const List = ({ images, style = {} }) => (
  <section className="PhotoList" style={style}>
    {images.map(img => <ImageThumb key={img} id={img} />)}
  </section>
)

const mapImageListStateToProps = ({ searchField }) => ({
  images: searchField.images,
})

const PhotoList = connect(mapImageListStateToProps)(List)

export { PhotoList }

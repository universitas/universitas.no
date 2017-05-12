import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { updateSearch, fetchImages } from './actions'
import { selectImage } from '../EditImage/actions'
import { GetButton } from './GetButton'
import { SearchField } from './SearchField'
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
  <section className="PhotoListPanel" style={style}>
    <section className="controls">
      <SearchField /> <GetButton />
    </section>
    <section className="photoList">
      {images.map(img => <ImageThumb key={img} id={img} />)}
    </section>
  </section>
)

const mapImageListStateToProps = ({ imageList }) => ({
  images: imageList,
})

const PhotoList = connect(mapImageListStateToProps)(List)

export { PhotoList }

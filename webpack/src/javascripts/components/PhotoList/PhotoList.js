import PropTypes from 'prop-types'
import React from 'react'
import { updateSearch, fetchImages } from './actions'
import { selectImage } from '../../containers/actions'

const Thumb = ({ src, onClick, title }) => (
  <img className="preview" onClick={onClick} src={src} title={title} />
)
const mapThumbStateToProps = ( {images}, {id} ) => ({
  src: images[id].thumbnail,
  title: images[id].source_file,
})
const mapThumbDispatchToProps = (dispatch, {id}) => ({
  onClick: () => dispatch(selectImage(id)),
})
const ImageThumb = connect(mapThumbStateToProps, mapThumbDispatchToProps)(Thumb)

const List = ({ images }) => (
  <div className="previews" >
    { images.map( img => <ImageThumb key={ img } id={ img } /> ) }
  </div>
)

const mapImageListStateToProps = ({imageList}) => ({ imageList })
const imageList = connect(mapImageListStateToProps, null)(List)


let SearchField = ({content, updateSearch, clearSearch}) => (
  <form>
    <input onUpdate={onUpdate} placeholder='hello' />
    <button onClick={clearSearch} />
  </form>
)

const mapStateToProps = ( state ) => ({
  content: state.searchField.content,
})
const mapDispatchToProps = (dispatch, { search_field }) => ({
  updateSearch: dispatch(),
  clearSearch: dispatch(),
})
SearchField = connect(mapStateToProps, mapDispatchToProps)(SearchField)

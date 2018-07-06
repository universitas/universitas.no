import React from 'react'
import cx from 'classnames'
import { modelSelectors, modelActions } from 'ducks/basemodel'
import { deleteStoryImage } from 'ducks/storyimage'
import { connect } from 'react-redux'
import ImageData from 'components/ImageData'
import Tool from 'components/Tool'
import StoryImageForm from './StoryImageForm.js'
import 'styles/storyimage.scss'

const StoryImageActions = ({ deleteHandler, viewPhoto, imagefile }) => (
  <div className="Actions">
    <Tool
      label="slett"
      className="warn"
      icon="Delete"
      onClick={deleteHandler}
    />
    <Tool
      label="foto"
      disabled={!imagefile}
      className="ok"
      icon="Eye"
      onClick={viewPhoto(imagefile)}
    />
  </div>
)

const { reverseUrl: viewPhoto, itemRequested: fetchPhoto } = modelActions(
  'photos',
)
const { itemRequested: fetchStoryImage } = modelActions('storyimages')

const ImageFile = connect(
  (state, { pk }) => modelSelectors('photos').getItem(pk)(state),
  (dispatch, { pk }) => ({ fetch: () => dispatch(fetchPhoto(pk)) }),
)(
  ({ pk, fetch, thumb, small, ...props }) =>
    props.id ? (
      <ImageData pk={pk} {...props} thumb={small} />
    ) : (
      <div ref={fetch} />
    ),
)

const StoryImageItem = ({ pk, id, filename, fetch, ...props }) =>
  R.isNil(id) ? (
    <div ref={fetch} />
  ) : (
    <div className="StoryImageItem">
      <StoryImageActions {...props} />
      <ImageFile pk={props.imagefile} />
      <StoryImageForm pk={pk} />
    </div>
  )
const mapStateToProps = (state, { pk }) =>
  modelSelectors('storyimages').getItem(pk)(state)
const mapDispatchToProps = (dispatch, { pk }) => ({
  deleteHandler: () => dispatch(deleteStoryImage(pk)),
  viewPhoto: id => () =>
    dispatch(viewPhoto({ id, model: 'photos', detail: null })),
  fetch: () => dispatch(fetchStoryImage(pk)),
})
export default connect(mapStateToProps, mapDispatchToProps)(StoryImageItem)

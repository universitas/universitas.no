import React from 'react'
import cx from 'classnames'
import { modelSelectors, modelActions } from 'ducks/basemodel'
import { deleteStoryImage } from 'ducks/storyimage'
import { connect } from 'react-redux'
import Thumb from 'components/Thumb'
import Tool from 'components/Tool'
import StoryImageForm from './StoryImageForm.js'
import 'styles/storyimage.scss'

const StoryImageActions = ({ deleteHandler }) => (
  <div className="Actions">
    <Tool
      label="slett"
      className="warn"
      icon="Delete"
      onClick={deleteHandler}
    />
  </div>
)

const StoryImageItem = ({ pk, id, filename, thumb, fetch, ...props }) =>
  R.isNil(id) ? (
    <div ref={fetch}>...</div>
  ) : (
    <div className="StoryImageItem">
      <StoryImageActions {...props} />
      <Thumb src={thumb} title={filename} />
      <StoryImageForm pk={pk} />
    </div>
  )
const { getItem: getStoryImage } = modelSelectors('storyimages')
const { itemRequested } = modelActions('storyimages')
const mapStateToProps = (state, { pk }) => getStoryImage(pk)(state)
const mapDispatchToProps = (dispatch, { pk }) => ({
  deleteHandler: () => dispatch(deleteStoryImage(pk)),
  fetch: () => dispatch(itemRequested(pk)),
})
export default connect(mapStateToProps, mapDispatchToProps)(StoryImageItem)

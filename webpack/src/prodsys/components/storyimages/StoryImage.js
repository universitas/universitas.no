import './StoryImage.scss'
import cx from 'classnames'
import { connect } from 'react-redux'
import { Tool } from 'components/tool'
import { ImageData } from 'components/photos'
import { StoryImageForm } from '.'

import { actions, selectors } from './model.js'
import * as photo from 'components/photos/model.js'
import { deleteStoryImage } from 'ducks/storyimage'

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

const ImageFile = connect(
  (state, { pk }) => photo.selectors.getItem(pk)(state),
  (dispatch, { pk }) => ({
    fetch: () => dispatch(photo.actions.itemRequested(pk)),
  }),
)(
  ({ pk, fetch, thumb, small, ...props }) =>
    props.id ? (
      <ImageData pk={pk} {...props} thumb={small} />
    ) : (
      <div ref={fetch} />
    ),
)

const StoryImage = ({ pk, id, filename, fetch, ...props }) =>
  R.isNil(id) ? (
    <div ref={fetch} />
  ) : (
    <div className="StoryImage">
      <StoryImageActions {...props} />
      <ImageFile pk={props.imagefile} />
      <StoryImageForm pk={pk} />
    </div>
  )
const mapStateToProps = (state, { pk }) => selectors.getItem(pk)(state)
const mapDispatchToProps = (dispatch, { pk }) => ({
  deleteHandler: () => dispatch(deleteStoryImage(pk)),
  viewPhoto: id => () =>
    dispatch(photo.actions.reverseUrl({ id, detail: null })),
  fetch: () => dispatch(actions.itemRequested(pk)),
})
export default connect(mapStateToProps, mapDispatchToProps)(StoryImage)

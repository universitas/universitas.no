import './StoryImage.scss'
import cx from 'classnames'
import { connect } from 'react-redux'
import { Tool } from 'components/tool'
import { PhotoWidget, StoryImageForm } from '.'

import * as photo from 'components/photos/model.js'
import { actions, selectors } from './model.js'
import { deleteStoryImage } from 'ducks/actions.js'
import { toRoute } from 'prodsys/ducks/router'

const StoryImageActions = ({
  deleteHandler = null,
  viewPhoto = R.always(null),
  imagefile,
}) => (
  <div className="Actions">
    <Tool
      label="fjern"
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

export const PlaceHolder = () => (
  <div className="StoryImageItem" style={{ opacity: 0.5 }}>
    <StoryImageActions />
    <PhotoWidget />
    <StoryImageForm />
  </div>
)

const StoryImage = ({ pk, imagefile = null, deleteHandler, viewPhoto }) => {
  return (
    imagefile && (
      <div className="StoryImageItem">
        <StoryImageActions
          deleteHandler={deleteHandler}
          viewPhoto={viewPhoto}
          imagefile={imagefile}
        />
        <PhotoWidget id={pk} pk={imagefile} />
        <StoryImageForm pk={pk} />
      </div>
    )
  )
}

const mapStateToProps = (state, { pk }) => selectors.getItem(pk)(state)
const mapDispatchToProps = (dispatch, { pk }) => ({
  deleteHandler: () => dispatch(deleteStoryImage(pk)),
  viewPhoto: pk => () =>
    dispatch(toRoute({ model: 'photos', action: 'change', pk: pk })),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StoryImage)

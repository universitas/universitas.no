import './StoryImage.scss'
import cx from 'classnames'
import { connect } from 'react-redux'
import { Tool } from 'components/tool'
import { PhotoWidget, StoryImageForm } from '.'

import * as photo from 'components/photos/model.js'
import { actions, selectors } from './model.js'
import { deleteStoryImage } from 'ducks/storyimage'

const StoryImageActions = ({ deleteHandler, viewPhoto, imagefile }) => (
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

class StoryImage extends React.Component {
  componentDidMount() {
    const { fetch, id } = this.props
    if (!id) fetch()
  }
  render() {
    const { pk, id, ...props } = this.props
    if (!id) return <div className="StoryImage">Henter bilde</div>
    return (
      <div className="StoryImage">
        <StoryImageActions {...props} />
        <PhotoWidget pk={props.imagefile} />
        <StoryImageForm pk={pk} />
      </div>
    )
  }
}

const mapStateToProps = (state, { pk }) => selectors.getItem(pk)(state)
const mapDispatchToProps = (dispatch, { pk }) => ({
  deleteHandler: () => dispatch(deleteStoryImage(pk)),
  viewPhoto: id => () =>
    dispatch(photo.actions.reverseUrl({ id, detail: null })),
  fetch: () => dispatch(actions.itemRequested(pk)),
})

export default connect(mapStateToProps, mapDispatchToProps)(StoryImage)

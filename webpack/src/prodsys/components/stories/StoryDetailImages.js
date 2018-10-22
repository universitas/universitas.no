import cx from 'classnames'
import { connect } from 'react-redux'
import { StoryImage } from 'components/storyimages'
import Info from 'components/Info'

import * as storyimages from 'components/storyimages/model.js'
import * as photos from 'components/photos/model.js'

class StoryDetailImages extends React.Component {
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    this.props.selectPhotos(...R.pluck('imagefile', this.props.images))
    this.props.selectStoryImages(...R.pluck('id', this.props.images))
  }
  componentDidUpdate() {
    this.props.selectPhotos(...R.pluck('imagefile', this.props.images))
  }
  componentWillUnmount() {}
  render() {
    const { images, createHandler, deleteHandler } = this.props
    return (
      <div className="panelContent">
        {images.length == 0 && (
          <Info>
            Ingen bilder valgt i saken. Klikk på bilder for å legge til.
          </Info>
        )}
        {images.map(({ id }) => (
          <StoryImage key={id} pk={id} deleteHandler={deleteHandler} />
        ))}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({})
const mapDispatchToProps = {
  selectStoryImages: storyimages.actions.itemSelected,
  selectPhotos: photos.actions.itemSelected,
}
export default connect(mapStateToProps, mapDispatchToProps)(StoryDetailImages)

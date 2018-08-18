import cx from 'classnames'
import { StoryImage } from 'components/storyimages'

const StoryDetailImages = ({ images = [], createHandler, deleteHandler }) => (
  <div className="panelContent">
    {images.map(({ id }) => (
      <StoryImage key={id} pk={id} deleteHandler={deleteHandler} />
    ))}
  </div>
)

export default StoryDetailImages

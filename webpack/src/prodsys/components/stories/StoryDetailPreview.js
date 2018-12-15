import cx from 'classnames'
import { StoryPreview } from 'universitas/components/Story'
import { selectors } from './model'
import { modelSelectors } from 'ducks/basemodel'
import { connect } from 'react-redux'
import { ZoomControl, PreviewIframe } from 'components/PreviewIframe'

const getPhoto = modelSelectors('photos').getItem
const getStoryImage = modelSelectors('storyimages').getItem

const StoryDetailPreview = props => {
  return (
    <PreviewIframe>
      <StoryPreview {...props} />
    </PreviewIframe>
  )
}

const mapStateToProps = (state, { pk }) => {
  const story = selectors.getItem(pk)(state)
  let images = []
  if (story.images) {
    images = story.images.map(image => ({
      ...image,
      ...getPhoto(image.imagefile)(state),
      ...getStoryImage(image.id)(state),
    }))
  }
  return { ...story, images }
}

export default connect(mapStateToProps)(StoryDetailPreview)

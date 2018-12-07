import cx from 'classnames'
import { StoryPreview } from 'universitas/components/Story'
import { selectors } from './model'
import { modelSelectors } from 'ducks/basemodel'
import { connect } from 'react-redux'
import PreviewPanel from 'components/PreviewPanel'

const getPhoto = modelSelectors('photos').getItem
const getStoryImage = modelSelectors('storyimages').getItem

const StoryDetailPreview = props => {
  return (
    <PreviewPanel>
      <StoryPreview {...props} />
    </PreviewPanel>
  )
  return (
    <section className="itemList" style={{ padding: '1rem' }}>
      <StoryPreview {...props} />
    </section>
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

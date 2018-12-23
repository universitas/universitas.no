import cx from 'classnames'
import { StoryPreview } from 'universitas/components/Story'
import { selectors } from './model'
import { modelSelectors } from 'ducks/basemodel'
import { connect } from 'react-redux'
import { ZoomControl, PreviewIframe } from 'components/PreviewIframe'

const getPhoto = modelSelectors('photos').getItem
const getStoryImage = modelSelectors('storyimages').getItem

const StoryDetailPreview = props => (
  <PreviewIframe>{props.images && <StoryPreview {...props} />}</PreviewIframe>
)

const mapStateToProps = (state, { pk }) => {
  const story = selectors.getItem(pk)(state)
  return R.evolve({
    images: R.map(image => ({
      ...image,
      ...getPhoto(image.imagefile)(state),
      ...getStoryImage(image.id)(state),
    })),
  })(story)
}

export default connect(mapStateToProps)(StoryDetailPreview)

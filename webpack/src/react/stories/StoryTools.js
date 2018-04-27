import { connect } from 'react-redux'
import { modelSelectors, modelActions } from 'ducks/basemodel'
import Tool from 'components/Tool'
import DetailTopBar from 'components/DetailTopBar'

const model = 'stories'
const { fieldChanged, reverseUrl, itemCloned, itemDeSelected } = modelActions(
  model
)
const { getItem } = modelSelectors(model)

const openUrl = url => () => window.open(url)

const StoryTools = ({
  trashStory,
  cloneStory,
  closeStory,
  imagesDetail,
  textDetail,
  edit_url,
  public_url,
  ...props
}) => (
  <DetailTopBar {...props}>
    <Tool icon="Close" title="lukk saken" onClick={closeStory} />
    <Tool icon="Add" title="kopier saken" onClick={cloneStory} />
    <Tool icon="Camera" title="bilder" onClick={imagesDetail} />
    <Tool icon="TextFields" title="tekst" onClick={textDetail} />
    <Tool
      icon="Newspaper"
      title="se saken på universitas.no"
      onClick={openUrl(public_url)}
    />
    <Tool
      icon="Tune"
      title="rediger i django-admin"
      onClick={openUrl(edit_url)}
    />
  </DetailTopBar>
)

const mapStateToProps = (state, { pk }) => getItem(pk)(state)

const mapDispatchToProps = (dispatch, { pk }) => ({
  trashStory: () => dispatch(fieldChanged(pk, 'publication_status', 15)),
  closeStory: () => dispatch(reverseUrl({ id: null, detail: null })),
  imagesDetail: () => dispatch(reverseUrl({ detail: 'images' })),
  textDetail: () => dispatch(reverseUrl({ detail: null })),
  cloneStory: () => dispatch(itemCloned(pk)),
})

export default connect(mapStateToProps, mapDispatchToProps)(StoryTools)

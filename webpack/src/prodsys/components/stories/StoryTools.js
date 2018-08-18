import { connect } from 'react-redux'
import { Tool } from 'components/tool'
import DetailTopBar from 'components/DetailTopBar'
import { actions, selectors } from './model.js'

const openUrl = url => () => window.open(url)

const StoryTools = ({
  trashStory,
  cloneStory,
  closeStory,
  imagesDetail,
  textDetail,
  edit_url,
  public_url,
  detail,
  ...props
}) => (
  <DetailTopBar {...props}>
    <Tool icon="Close" title="lukk saken" onClick={closeStory} />
    <Tool icon="Add" title="kopier saken" onClick={cloneStory} />
    <Tool
      icon="Camera"
      active={detail == 'images'}
      title="bilder"
      onClick={detail == 'images' ? textDetail : imagesDetail}
    />
    <Tool
      icon="Newspaper"
      title={`se saken på universitas.no\n${public_url}`}
      onClick={openUrl(public_url)}
    />
    <Tool
      icon="Tune"
      title="rediger i django-admin"
      onClick={openUrl(edit_url)}
    />
  </DetailTopBar>
)

const mapStateToProps = (state, { pk }) => selectors.getItem(pk)(state)

const mapDispatchToProps = (dispatch, { pk }) => ({
  trashStory: () =>
    dispatch(actions.fieldChanged(pk, 'publication_status', 15)),
  closeStory: () => dispatch(actions.reverseUrl({ id: null, detail: null })),
  imagesDetail: () => dispatch(actions.reverseUrl({ detail: 'images' })),
  textDetail: () => dispatch(actions.reverseUrl({ detail: null })),
  cloneStory: () => dispatch(actions.itemCloned(pk)),
})

export default connect(mapStateToProps, mapDispatchToProps)(StoryTools)

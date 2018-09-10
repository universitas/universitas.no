import { connect } from 'react-redux'
import { Tool } from 'components/tool'
import DetailTopBar from 'components/DetailTopBar'
import { MODEL, actions, selectors } from './model.js'
import { toRoute } from 'prodsys/ducks/router'

const openUrl = url => () => window.open(url)

const StoryTools = ({
  trashStory,
  cloneStory,
  closeStory,
  imagesDetail,
  textDetail,
  edit_url,
  public_url,
  action,
  pk,
  title,
  working_title,
}) => (
  <DetailTopBar title={title || working_title || '(ingen tittel)'} pk={pk}>
    <Tool icon="Close" title="lukk saken" onClick={closeStory} />
    <Tool icon="Add" title="kopier saken" onClick={cloneStory} />
    <Tool
      icon="Camera"
      active={action == 'images'}
      title="bilder"
      onClick={action == 'images' ? textDetail : imagesDetail}
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
  closeStory: () => dispatch(toRoute({ model: MODEL, action: 'list' })),
  imagesDetail: () =>
    dispatch(toRoute({ model: MODEL, action: 'images', pk: pk })),
  textDetail: () =>
    dispatch(toRoute({ model: MODEL, action: 'change', pk: pk })),
  cloneStory: () => dispatch(actions.itemCloned(pk)),
})

export default connect(mapStateToProps, mapDispatchToProps)(StoryTools)

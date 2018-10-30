import { connect } from 'react-redux'
import { Tool } from 'components/tool'
import DetailTopBar from 'components/DetailTopBar'
import { MODEL, actions, selectors } from './model.js'
import { toRoute } from 'prodsys/ducks/router'
import OpenInDjangoAdmin from 'components/OpenInDjangoAdmin'

const openUrl = url => () => window.open(url)

const StoryTools = ({
  trashStory,
  cloneStory,
  imagesDetail,
  textDetail,
  previewDetail,
  edit_url,
  public_url,
  action,
  pk,
  title,
  working_title,
}) => (
  <React.Fragment>
    <Tool icon="Add" label="kopier" title="kopier saken" onClick={cloneStory} />
    <Tool
      icon="Eye"
      label="vis"
      title="forhåndsvisning"
      onClick={previewDetail}
    />
    <Tool
      icon="Camera"
      active={action == 'images'}
      title="bilder"
      label="bilder"
      onClick={action == 'images' ? textDetail : imagesDetail}
    />
    <Tool
      icon="Newspaper"
      title={public_url && `se saken på universitas.no\n${public_url}`}
      label="åpne"
      onClick={public_url && openUrl(public_url)}
      disabled={!public_url}
    />
    <OpenInDjangoAdmin pk={pk} path="stories/story" />
  </React.Fragment>
)

const mapStateToProps = (state, { pk }) => selectors.getItem(pk)(state)

const mapDispatchToProps = (dispatch, { pk }) => ({
  trashStory: () =>
    dispatch(actions.fieldChanged(pk, 'publication_status', 15)),
  imagesDetail: () =>
    dispatch(toRoute({ model: MODEL, action: 'images', pk: pk })),
  textDetail: () =>
    dispatch(toRoute({ model: MODEL, action: 'change', pk: pk })),
  previewDetail: () =>
    dispatch(toRoute({ model: MODEL, action: 'preview', pk: pk })),
  cloneStory: () => dispatch(actions.itemCloned(pk)),
})

export default connect(mapStateToProps, mapDispatchToProps)(StoryTools)

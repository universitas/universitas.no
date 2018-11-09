import { connect } from 'react-redux'
import { Tool } from 'components/tool'
import DetailTopBar from 'components/DetailTopBar'
import { MODEL, actions, selectors } from './model.js'
import { toRoute } from 'prodsys/ducks/router'
import OpenInDjangoAdmin from 'components/OpenInDjangoAdmin'
import { parseText, renderText } from 'markup'

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
  bodytext_markup,
  fixStory,
}) => (
  <React.Fragment>
    <Tool icon="Add" label="kopier" title="kopier saken" onClick={cloneStory} />
    <Tool
      icon="Camera"
      active={action == 'images'}
      label="bilder"
      title="koble bilder til saken"
      onClick={action == 'images' ? textDetail : imagesDetail}
    />
    <Tool
      icon="Newspaper"
      label="åpne"
      title={public_url && `se saken på universitas.no\n${public_url}`}
      onClick={public_url && openUrl(public_url)}
      disabled={!public_url}
    />
    <Tool
      icon="Eye"
      active={action == 'preview'}
      label="vis"
      title="forhåndsvisning"
      disabled={!pk}
      onClick={action == 'preview' ? textDetail : previewDetail}
    />
    <Tool
      icon="Magic"
      label="fiks"
      title="fiks tags"
      onClick={() => fixStory(bodytext_markup)}
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
  fixStory: text =>
    dispatch(
      actions.fieldChanged(pk, 'bodytext_markup', renderText(parseText(text))),
    ),
})

export default connect(mapStateToProps, mapDispatchToProps)(StoryTools)

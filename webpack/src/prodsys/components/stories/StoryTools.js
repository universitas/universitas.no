import { connect } from 'react-redux'
import { Tool } from 'components/tool'
import { MODEL, actions, selectors } from './model.js'
import { toRoute } from 'prodsys/ducks/router'
import OpenInDjangoAdmin from 'components/OpenInDjangoAdmin'
import { parseText, renderText } from 'markup'
import { getPanes, togglePane } from 'prodsys/ducks/ux'
import ModelTools from 'components/ModelTools.js'

const openUrl = url => () => window.open(url)

let PaneTool = ({ name, active, toggle, icon, label, title }) => (
  <Tool
    {...{ icon, label, title }}
    active={active}
    onClick={() => toggle(!active)}
  />
)

PaneTool = connect(
  (state, { name }) =>
    R.pipe(
      getPanes,
      R.prop(name),
      R.objOf('active'),
    )(state),
  (dispatch, { name }) => ({
    toggle: status => dispatch(togglePane(name, status)),
  }),
)(PaneTool)

const StoryTools = ({
  trashStory,
  cloneStory,
  edit_url,
  public_url,
  action,
  pk,
  title,
  working_title,
  bodytext_markup,
  fixStory,
}) => (
  <ModelTools>
    <Tool icon="Add" label="kopier" title="kopier saken" onClick={cloneStory} />
    <PaneTool
      icon="TextFields"
      label="tekst"
      title="rediger tekst"
      name="storyText"
    />
    <PaneTool
      icon="Images"
      label="bilder"
      title="koble bilder til saken"
      name="storyImages"
    />
    <PaneTool
      icon="Eye"
      label="vis"
      title="forhåndsvisning"
      disabled={!pk}
      name="storyPreview"
    />
    <Tool
      icon="Magic"
      label="fiks"
      title="fiks tags"
      onClick={() => fixStory(bodytext_markup)}
    />
    <Tool
      icon="Newspaper"
      label="åpne"
      title={public_url && `se saken på universitas.no\n${public_url}`}
      onClick={public_url && openUrl(public_url)}
      disabled={!public_url}
    />
    <OpenInDjangoAdmin pk={pk} path="stories/story" />
  </ModelTools>
)

const mapStateToProps = (state, { pk }) => selectors.getItem(pk)(state)

const mapDispatchToProps = (dispatch, { pk }) => ({
  trashStory: () =>
    dispatch(actions.fieldChanged(pk, 'publication_status', 15)),
  cloneStory: () => dispatch(actions.itemCloned(pk)),
  fixStory: text =>
    dispatch(
      actions.fieldChanged(pk, 'bodytext_markup', renderText(parseText(text))),
    ),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StoryTools)

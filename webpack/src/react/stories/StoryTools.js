import { connect } from 'react-redux'
import { push } from 'redux-little-router'
import { modelSelectors, modelActions } from 'ducks/basemodel'
import Tool from 'components/Tool'

const model = 'stories'
const { fieldChanged, itemCloned, itemDeSelected } = modelActions(model)
const { getItem } = modelSelectors(model)

const openUrl = url => () => window.open(url)

const ToolBar = props => <div {...props} />

const StoryTools = ({
  trashStory,
  cloneStory,
  closeStory,
  edit_url,
  public_url,
}) => (
  <ToolBar className="DetailToolBar">
    <Tool icon="Close" title="lukk saken" onClick={closeStory} />
    <Tool icon="Add" title="kopier saken" onClick={cloneStory} />
    <Tool icon="Delete" title="slett saken" onClick={trashStory} />
    <Tool
      icon="Laptop"
      title="se saken på universitas.no"
      onClick={openUrl(public_url)}
    />
    <Tool
      icon="Tune"
      title="rediger i django-admin"
      onClick={openUrl(edit_url)}
    />
  </ToolBar>
)

const mapStateToProps = (state, { pk }) => getItem(pk)(state)

const mapDispatchToProps = (dispatch, { pk }) => ({
  trashStory: () => dispatch(fieldChanged(pk, 'publication_status', 15)),
  closeStory: () => dispatch(push('/stories')),
  cloneStory: () => dispatch(itemCloned(pk)),
})

export default connect(mapStateToProps, mapDispatchToProps)(StoryTools)

import { modelSelectors, modelActions } from 'ducks/basemodel'
import { connect } from 'react-redux'
import { Tool } from 'components/tool'

const AutosaveTool = ({ active, autosaveToggle }) => (
  <Tool
    className="AutoSaveTool"
    icon={active ? 'Sync' : 'NoSync'}
    label="sync"
    title={active ? 'automatisk lagring' : 'manuell lagring'}
    onClick={autosaveToggle}
  />
)

const mapStateToProps = (state, { model }) => ({
  active: modelSelectors(model).getAutosave(state),
})
const mapDispatchToProps = (dispatch, { model }) => ({
  autosaveToggle: () => dispatch(modelActions(model).autosaveToggle()),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AutosaveTool)

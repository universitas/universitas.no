import { modelSelectors, modelActions } from 'ducks/basemodel'
import { connect } from 'react-redux'
import { Tool } from 'components/tool'
import cx from 'classnames'

const SaveTool = ({ active, status, saveItem }) => (
  <Tool
    icon="Save"
    disabled={!active || status == 'ok' || status == 'syncing'}
    onClick={saveItem}
    title={active ? 'lagre manuelt' : 'lagres automatisk'}
  />
)

const AutosaveTool = ({
  pk,
  active,
  autosaveToggle,
  status,
  saveItem,
  saveNew,
}) =>
  pk == 0 ? (
    <SaveTool saveItem={saveNew} active={true} status={status} />
  ) : (
    <>
      <Tool
        className={cx('AutosaveTool', {
          nosyncing: true,
          syncing: active && status == 'syncing',
        })}
        icon={active ? 'Sync' : 'NoSync'}
        title={active ? 'automatisk lagring' : 'skru på automatisk lagring'}
        onClick={autosaveToggle}
      />
      <SaveTool active={!active} status={status} saveItem={saveItem} />
    </>
  )

const mapStateToProps = (state, { model, pk }) =>
  R.applySpec({
    active: modelSelectors(model).getAutosave,
    status: modelSelectors(model).getItemStatus(pk),
  })(state)

const mapDispatchToProps = (dispatch, { model, pk }) => ({
  autosaveToggle: () => dispatch(modelActions(model).autosaveToggle()),
  saveItem: () => dispatch(modelActions(model).itemSave(pk, null)),
  saveNew: () => dispatch(modelActions(model).itemPost(0)),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AutosaveTool)

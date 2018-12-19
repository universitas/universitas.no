import { connect } from 'react-redux'
import { Tool } from 'components/tool'
import { MODEL, actions, selectors } from './model.js'
import { toRoute } from 'prodsys/ducks/router'
import OpenInDjangoAdmin from 'components/OpenInDjangoAdmin'
import ModelTools from 'components/ModelTools'

const openUrl = url => () => window.open(url)

const ContributorTools = ({ pk, action, create, saveNew }) => (
  <ModelTools>
    {action == 'create' ? (
      <Tool icon="Save" label="lagre" title="ny person" onClick={saveNew} />
    ) : (
      <Tool icon="Add" label="ny" title="ny person" onClick={create} />
    )}
    <OpenInDjangoAdmin pk={pk} path="contributors/contributor" />
  </ModelTools>
)

const mapStateToProps = (state, { pk }) => selectors.getItem(pk)(state)
const mapDispatchToProps = (dispatch, { pk }) => ({
  create: () => dispatch(toRoute({ model: MODEL, action: 'create' })),
  saveNew: () => dispatch(actions.itemPost(0)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ContributorTools)

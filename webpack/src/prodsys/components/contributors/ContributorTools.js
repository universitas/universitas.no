import { connect } from 'react-redux'
import { PermissionTool } from 'components/tool'
import { MODEL, actions, selectors } from './model.js'
import { toRoute } from 'prodsys/ducks/router'
import OpenInDjangoAdmin from 'components/OpenInDjangoAdmin'
import ModelTools from 'components/ModelTools'

const openUrl = url => () => window.open(url)

const ContributorTools = ({ pk, action, create }) => (
  <ModelTools>
    <PermissionTool
      disabled={action == 'create'}
      icon="Add"
      label="ny"
      title="legg til ny medarbeider"
      onClick={create}
      permission="add contributor"
    />
    <OpenInDjangoAdmin pk={pk} path="contributors/contributor" />
  </ModelTools>
)

const mapStateToProps = (state, { pk }) => selectors.getItem(pk)(state)
const mapDispatchToProps = (dispatch, { pk }) => ({
  create: () => dispatch(toRoute({ model: MODEL, action: 'create' })),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ContributorTools)

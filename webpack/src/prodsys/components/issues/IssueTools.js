import { connect } from 'react-redux'
import DetailTopBar from 'components/DetailTopBar'
import { Tool } from 'components/tool'
import { MODEL, selectors } from './model.js'
import { toRoute } from 'prodsys/ducks/router'
import OpenInDjangoAdmin from 'components/OpenInDjangoAdmin'
import ModelTools from 'components/ModelTools'

const openUrl = url => () => window.open(url)

const IssueTools = ({ pk, issue_name, autocrop, close, openAdmin }) => (
  <ModelTools>
    <OpenInDjangoAdmin pk={pk} path="issues/issue" />
  </ModelTools>
)

const mapStateToProps = (state, { pk }) => selectors.getItem(pk)(state)
const mapDispatchToProps = (dispatch, { pk }) => ({
  openAdmin: openUrl(`/admin/issues/issue/${pk}/change/`),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IssueTools)

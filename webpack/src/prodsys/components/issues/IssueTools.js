import { connect } from 'react-redux'
import DetailTopBar from 'components/DetailTopBar'
import { Tool } from 'components/tool'
import { MODEL, selectors } from './model.js'
import { toRoute } from 'prodsys/ducks/router'
import OpenInDjangoAdmin from 'components/OpenInDjangoAdmin'

const openUrl = url => () => window.open(url)

const IssueTools = ({ pk, issue_name, autocrop, close, openAdmin }) => (
  <React.Fragment>
    <OpenInDjangoAdmin pk={pk} path="issues/issue" />
  </React.Fragment>
)

const mapStateToProps = (state, { pk }) => selectors.getItem(pk)(state)
const mapDispatchToProps = (dispatch, { pk }) => ({
  openAdmin: openUrl(`/admin/issues/issue/${pk}/change/`),
})

export default connect(mapStateToProps, mapDispatchToProps)(IssueTools)

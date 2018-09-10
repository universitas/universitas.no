import { connect } from 'react-redux'
import DetailTopBar from 'components/DetailTopBar'
import { Tool } from 'components/tool'
import { MODEL, selectors } from './model.js'
import { toRoute } from 'prodsys/ducks/router'

const openUrl = url => () => window.open(url)

const IssueTools = ({ pk, issue_name, autocrop, close, openAdmin }) => (
  <DetailTopBar title={`Universitas ${issue_name}`} pk={pk}>
    <Tool icon="Close" title="lukk" onClick={close} />
    <Tool icon="Tune" title="rediger i django-admin" onClick={openAdmin} />
  </DetailTopBar>
)

const mapStateToProps = (state, { pk }) => selectors.getItem(pk)(state)
const mapDispatchToProps = (dispatch, { pk }) => ({
  close: () => dispatch(toRoute({ model: MODEL })),
  openAdmin: openUrl(`/admin/issues/issue/${pk}/change/`),
})

export default connect(mapStateToProps, mapDispatchToProps)(IssueTools)

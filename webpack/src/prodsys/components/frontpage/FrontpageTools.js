import { connect } from 'react-redux'
import DetailTopBar from 'components/DetailTopBar'
import { Tool } from 'components/tool'
import { MODEL, selectors } from './model.js'
import { toRoute } from 'prodsys/ducks/router'

const openUrl = url => () => window.open(url)

const ToolBar = props => <div {...props} />

const FrontpageTools = ({ pk, headline, close, openAdmin }) => (
  <DetailTopBar title={`${headline}`} pk={pk}>
    <Tool icon="Newspaper" title={'forsiden'} onClick={openUrl('/')} />
    <Tool icon="Tune" title="rediger i django-admin" onClick={openAdmin} />
  </DetailTopBar>
)

const mapStateToProps = (state, { pk }) => selectors.getItem(pk)(state)

const mapDispatchToProps = (dispatch, { pk }) => ({
  close: () => dispatch(toRoute({ model: MODEL })),
  openAdmin: openUrl(
    `/admin/frontpage/frontpagestory/${pk ? pk + '/change/' : ''}`,
  ),
})

export default connect(mapStateToProps, mapDispatchToProps)(FrontpageTools)

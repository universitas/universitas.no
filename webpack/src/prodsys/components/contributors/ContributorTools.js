import { connect } from 'react-redux'
import { push } from 'redux-little-router'
import { Tool } from 'components/tool'
import DetailTopBar from 'components/DetailTopBar'
import { MODEL, actions, selectors } from './model.js'

const openUrl = url => () => window.open(url)

const ToolBar = props => <div {...props} />

const ContributorTools = ({ pk, display_name, autocrop, close, openAdmin }) => (
  <DetailTopBar pk={pk} title={display_name}>
    <Tool icon="Close" title="lukk" onClick={close} />
    <Tool icon="Tune" title="rediger i django-admin" onClick={openAdmin} />
  </DetailTopBar>
)

const mapStateToProps = (state, { pk }) => selectors.getItem(pk)(state)

const mapDispatchToProps = (dispatch, { pk }) => ({
  close: () => dispatch(push(`/${MODEL}`)),
  openAdmin: openUrl(`/admin/contributors/contributor/${pk}/change/`),
})

export default connect(mapStateToProps, mapDispatchToProps)(ContributorTools)

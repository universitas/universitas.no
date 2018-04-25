import { connect } from 'react-redux'
import { push } from 'redux-little-router'
import { modelSelectors, modelActions } from 'ducks/basemodel'
import Tool from 'components/Tool'
import DetailTopBar from 'components/DetailTopBar'

const model = 'contributors'
const { fieldChanged } = modelActions(model)
const { getItem } = modelSelectors(model)

const openUrl = url => () => window.open(url)

const ToolBar = props => <div {...props} />

const ContributorTools = ({ pk, display_name, autocrop, close, openAdmin }) => (
  <DetailTopBar pk={pk} title={display_name}>
    <Tool icon="Close" title="lukk" onClick={close} />
    <Tool icon="Tune" title="rediger i django-admin" onClick={openAdmin} />
  </DetailTopBar>
)

const mapStateToProps = (state, { pk }) => getItem(pk)(state)

const mapDispatchToProps = (dispatch, { pk }) => ({
  close: () => dispatch(push(`/${model}`)),
  openAdmin: openUrl(`/admin/contributors/contributor/${pk}/change/`),
})

export default connect(mapStateToProps, mapDispatchToProps)(ContributorTools)

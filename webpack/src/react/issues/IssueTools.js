import { connect } from 'react-redux'
import { Add, Delete, Laptop, Tune, Close } from 'components/Icons'
import { push } from 'redux-little-router'
import { modelSelectors, modelActions } from 'ducks/basemodel'

const model = 'issues'
const { fieldChanged } = modelActions(model)
const { getItem } = modelSelectors(model)

const openUrl = url => () => window.open(url)

const Tool = ({ Icon, ...props }) => (
  <div className="Tool" {...props}>
    <Icon />
  </div>
)

const ToolBar = props => <div {...props} />

const IssueTools = ({ autocrop, close, openAdmin }) => (
  <ToolBar className="DetailToolBar">
    <Tool Icon={Close} title="lukk" onClick={close} />
    <Tool Icon={Tune} title="rediger i django-admin" onClick={openAdmin} />
  </ToolBar>
)

const mapStateToProps = (state, { pk }) => getItem(pk)

const mapDispatchToProps = (dispatch, { pk }) => ({
  close: () => dispatch(push(`/${model}`)),
  openAdmin: openUrl(`/admin/issues/issue/${pk}/change/`),
})

export default connect(mapStateToProps, mapDispatchToProps)(IssueTools)

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

const IssueTools = ({ autocrop, close, edit_url = 'http://example.com' }) => (
  <ToolBar className="DetailToolBar">
    <Tool Icon={Close} title="lukk saken" onClick={close} />
    <Tool
      Icon={Tune}
      title="rediger i django-admin"
      onClick={openUrl(edit_url)}
    />
  </ToolBar>
)

const mapStateToProps = (state, { pk }) => getItem(pk)

const mapDispatchToProps = (dispatch, { pk }) => ({
  close: () => dispatch(push(`/${model}`)),
})

export default connect(mapStateToProps, mapDispatchToProps)(IssueTools)

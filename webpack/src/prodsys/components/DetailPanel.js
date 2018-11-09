import { modelSelectors } from 'ducks/basemodel'
import { connect } from 'react-redux'
import { Tool } from 'components/tool'
import { toRoute } from 'prodsys/ducks/router'
import cx from 'classnames'
const DetailTopBar = ({ pk, title = 'no title', close }) => (
  <div className="DetailTopBar">
    <Tool icon="Close" title="lukk" onClick={close} />
    <div className="pk">{pk}</div>
    <div className="title">{title}</div>
  </div>
)
const mapStateToProps = (state, { pk, model, getTitle = R.prop('pk') }) => {
  const item = modelSelectors(model).getItem(pk)(state) || {}
  return { title: getTitle(item) }
}
const mapDispatchToProps = (dispatch, { model }) => ({
  close: () => dispatch(toRoute({ model: model, action: 'list' })),
})
const ConnectedTopBar = connect(mapStateToProps, mapDispatchToProps)(
  DetailTopBar,
)

const DetailPanel = ({ children, className, ...props }) => (
  <div className={cx('DetailPanel', className)}>
    <ConnectedTopBar {...props} />
    <div className="panelContent">{children}</div>
  </div>
)

export default DetailPanel

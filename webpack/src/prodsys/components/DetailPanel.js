import { modelSelectors } from 'ducks/basemodel'
import { connect } from 'react-redux'
import { Tool } from 'components/tool'
import { toRoute } from 'prodsys/ducks/router'
import Panel from 'components/Panel'
import cx from 'classnames'

const DetailTopBar = ({ pk, title = '...', close, children }) => (
  <div className="DetailTopBar">
    <Tool icon="Close" title="lukk" onClick={close} />
    <div className="pk">{pk || 'opprett ny'}</div>
    <div className="title">{title}</div>
  </div>
)

const DetailPanel = ({
  children,
  title,
  className,
  pk,
  model,
  close,
  scroll = false,
  footer,
}) =>
  R.isNil(pk) ? null : (
    <Panel
      className={cx('DetailPanel', className)}
      scroll={scroll}
      header={<DetailTopBar {...{ pk, title, close }} />}
      footer={footer}
    >
      {children}
    </Panel>
  )

const mapStateToProps = (
  state,
  { pk, model, getClass = R.always(''), getTitle = R.prop('pk') },
) =>
  R.applySpec({ title: getTitle, className: getClass })(
    modelSelectors(model).getItem(pk)(state),
  )

const mapDispatchToProps = (dispatch, { model }) => ({
  close: () => dispatch(toRoute({ model: model, action: 'list' })),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DetailPanel)

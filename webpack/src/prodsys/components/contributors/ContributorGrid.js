import cx from 'classnames'
import { connect } from 'react-redux'
import ModelField from 'components/ModelField'
import { fields, actions, selectors, MODEL } from './model.js'

const ContributorField = ({ editable, ...props }) => (
  <ModelField editable={false} model={MODEL} {...props} />
)

const GridItem = ({ pk, onClick, className = '' }) => (
  <div key={pk} onClick={onClick} className={cx('GridItem', className)}>
    <ContributorField pk={pk} {...fields.thumb} label />
    <ContributorField pk={pk} {...fields.display_name} label />
    <ContributorField pk={pk} {...fields.email} label />
    <ContributorField pk={pk} {...fields.phone} label />
  </div>
)

const ConnectedGridItem = connect(
  (state, { pk }) => {
    const data = selectors.getItem(pk)(state) || {}
    const selected = selectors.getCurrentItemId(state) === pk
    const { dirty } = data
    const className = cx('GridItem', { dirty, selected })
    return { ...data, className }
  },
  (dispatch, { pk }) => ({
    onClick: e => dispatch(actions.reverseUrl({ id: pk })),
  }),
)(GridItem)

const ContributorGrid = ({ items = [] }) => (
  <div className="ItemGrid">
    {items.map(pk => <ConnectedGridItem key={pk} fields={fields} pk={pk} />)}
  </div>
)
export default connect(state => ({ items: selectors.getItemList(state) }))(
  ContributorGrid,
)

import cx from 'classnames'
import { connect } from 'react-redux'
import { Field, actions, selectors, MODEL } from './model.js'
import { toRoute } from 'prodsys/ducks/router'

const GridItem = ({ pk, onClick, className = '' }) => (
  <div key={pk} onClick={onClick} className={cx('GridItem', className)}>
    <Field pk={pk} name="pdfs" label={null} />
    <Field pk={pk} name="publication_date" />
    <Field pk={pk} name="issue_name" />
    <Field pk={pk} name="issue_type" />
  </div>
)

const ConnectedGridItem = connect(
  (state, { pk }) => {
    const data = selectors.getItem(pk)(state) || {}
    const selected = selectors.getCurrentItemId(state) === pk
    const { dirty } = data
    const className = cx({ dirty, selected })
    return { ...data, className }
  },
  (dispatch, { pk }) => ({
    onClick: e => dispatch(toRoute({ model: MODEL, action: 'change', pk: pk })),
  }),
)(GridItem)

const IssueGrid = ({ items = [] }) => (
  <div className="ItemGrid IssueGrid">
    {items.map(pk => <ConnectedGridItem key={pk} pk={pk} />)}
  </div>
)
export default connect(state => ({ items: selectors.getItemList(state) }))(
  IssueGrid,
)

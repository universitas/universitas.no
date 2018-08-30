import cx from 'classnames'
import { connect } from 'react-redux'
import ModelField from 'components/ModelField'
import { MODEL, actions, selectors, fields } from './model.js'

const IssueField = ({ editable, ...props }) => (
  <ModelField editable={false} model={MODEL} {...props} />
)

const GridItem = ({ pk, onClick, className = '' }) => (
  <div key={pk} onClick={onClick} className={cx('GridItem', className)}>
    <IssueField pk={pk} {...fields.pdfs} label />
    <IssueField pk={pk} {...fields.publication_date} />
    <IssueField pk={pk} {...fields.issue_name} />
    <IssueField pk={pk} {...fields.issue_type} />
  </div>
)

const ConnectedGridItem = connect(
  (state, { pk }) => {
    const data = selectors.getItem(pk)(state) || {}
    const selected = selectors.getCurrentItemId(state) === pk
    const { dirty } = data
    const className = cx({ dirty, selected })
    return { ...data, className, model: MODEL }
  },
  (dispatch, { pk }) => ({
    onClick: e => dispatch(actions.reverseUrl({ id: pk })),
  }),
)(GridItem)

const IssueGrid = ({ items = [] }) => (
  <div className="ItemGrid IssueGrid">
    {items.map(pk => <ConnectedGridItem key={pk} fields={fields} pk={pk} />)}
  </div>
)
export default connect(state => ({ items: selectors.getItemList(state) }))(
  IssueGrid,
)

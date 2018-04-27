import 'styles/storylist.scss'
import cx from 'classnames'
import { connect } from 'react-redux'
import { detailFields as fields } from 'issues/model'
import { modelActions, modelSelectors } from 'ducks/basemodel'
import ModelField from 'components/ModelField'

const MODEL = 'issues'

const { getItemList, getItem, getCurrentItemId } = modelSelectors(MODEL)
const { reverseUrl } = modelActions(MODEL)

const IssueField = ({ editable, ...props }) => (
  <ModelField editable={false} model={MODEL} {...props} />
)

const GridItem = ({ pk, onClick, className = '' }) => (
  <div key={pk} onClick={onClick} className={cx('GridItem', className)}>
    <IssueField pk={pk} {...fields.publication_date} />
    <IssueField pk={pk} {...fields.issue_name} />
    <IssueField pk={pk} {...fields.issue_type} />
    <IssueField pk={pk} {...fields.pdfs} label />
  </div>
)

const ConnectedGridItem = connect(
  (state, { pk }) => {
    const data = getItem(pk)(state) || {}
    const selected = getCurrentItemId(state) === pk
    const { dirty } = data
    const className = cx({ dirty, selected })
    return { ...data, className, model: MODEL }
  },
  (dispatch, { pk }) => ({ onClick: e => dispatch(reverseUrl({ id: pk })) })
)(GridItem)

const IssueGrid = ({ items = [] }) => (
  <div className="ItemGrid IssueGrid">
    {items.map(pk => <ConnectedGridItem key={pk} fields={fields} pk={pk} />)}
  </div>
)
export default connect(state => ({ items: getItemList(state) }))(IssueGrid)

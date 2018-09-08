import cx from 'classnames'
import { connect } from 'react-redux'
import { Field, actions, selectors } from './model.js'

const TableCell = ({ label, className, onClick, ...props }) => (
  <div title={label} className={className} onClick={onClick}>
    <Field {...props} label />
  </div>
)

// render all headers in table
const DumbTableRow = props => (
  <React.Fragment>
    <TableCell {...props} name="working_title" />
    <TableCell {...props} name="publication_status" />
    <TableCell {...props} name="story_type" />
    <TableCell {...props} name="modified" relative />
    <TableCell {...props} name="images" />
  </React.Fragment>
)

const TableRow = connect(
  (state, { pk, row }) => {
    const data = selectors.getItem(pk)(state) || {}
    const { dirty, publication_status: status } = data
    const selected = selectors.getCurrentItemId(state) === pk
    const className = cx(`status-${status}`, 'TableCell', {
      dirty,
      selected,
      odd: row % 2,
    })
    return { className }
  },
  (dispatch, { pk }) => ({
    onClick: e => dispatch(actions.reverseUrl({ id: pk })),
  }),
)(DumbTableRow)

const StoryTable = ({ items = [] }) => (
  <section className="StoryTable">
    {items.map((pk, index) => <TableRow key={pk} pk={pk} row={index} />)}
  </section>
)
export default connect(state => ({ items: selectors.getItemList(state) }))(
  StoryTable,
)

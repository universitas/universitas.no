import cx from 'classnames'
import { connect } from 'react-redux'
import { MODEL, Field, actions, selectors } from './model.js'

import { getRoutePayload, toRoute } from 'prodsys/ducks/router'

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
  (state, { pk, row, selected, action }) => {
    const data = selectors.getItem(pk)(state) || {}
    const { dirty, publication_status: status } = data
    const className = cx(`status-${status}`, 'TableCell', {
      dirty,
      selected,
      odd: row % 2,
    })
    return { className }
  },
  (dispatch, { pk, action }) => ({
    onClick: e => dispatch(toRoute({ model: MODEL, action, pk: pk })),
  }),
)(DumbTableRow)

const StoryTable = ({ action, currentItem, items = [] }) => (
  <section className="StoryTable">
    {items.map((pk, index) => (
      <TableRow
        key={pk}
        pk={pk}
        row={index}
        action={action}
        selected={pk == currentItem}
      />
    ))}
  </section>
)
export default connect(state => {
  const { pk, action } = getRoutePayload(state)
  const items = selectors.getItemList(state)
  return {
    items,
    action: action == 'list' ? 'change' : action,
    currentItem: pk,
  }
})(StoryTable)

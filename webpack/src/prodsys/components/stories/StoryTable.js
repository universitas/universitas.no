import cx from 'classnames'
import { connect } from 'react-redux'
import ModelField from 'components/ModelField'
import { MODEL, fields, actions, selectors } from './model.js'

const listFields = R.pipe(
  R.pick([
    'working_title',
    'publication_status',
    'story_type',
    'modified',
    'images',
  ]),
  R.assocPath(['modified', 'relative'], true), // relative time
)(fields)

const renderFields = R.pipe(R.values, R.map(TableCell))

const TableCell = ({ label, className, onClick, ...props }) => (
  <div title={label} className={className} onClick={onClick}>
    <ModelField {...props} editable={false} />
  </div>
)

// render all headers in table
const TableRow = props =>
  R.values(listFields).map((fieldprops, index) => (
    <TableCell key={fieldprops.name} {...fieldprops} {...props} />
  ))

const ConnectedTableRow = connect(
  (state, { pk, row }) => {
    const data = selectors.getItem(pk)(state) || {}
    const { dirty, publication_status: status } = data
    const selected = selectors.getCurrentItemId(state) === pk
    const className = cx(`status-${status}`, 'TableCell', {
      dirty,
      selected,
      odd: row % 2,
    })
    return { className, model: MODEL }
  },
  (dispatch, { pk }) => ({
    onClick: e => dispatch(actions.reverseUrl({ id: pk })),
  }),
)(TableRow)

const StoryTable = ({ items = [] }) => (
  <section className="StoryTable">
    {items.map((pk, index) => (
      <ConnectedTableRow key={pk} pk={pk} row={index} />
    ))}
  </section>
)
export default connect(state => ({ items: selectors.getItemList(state) }))(
  StoryTable,
)

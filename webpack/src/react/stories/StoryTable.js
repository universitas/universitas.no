import cx from 'classnames'
import { connect } from 'react-redux'
import { detailFields } from 'stories/model'
import { modelActions, modelSelectors } from 'ducks/basemodel'
import ModelField from 'components/ModelField'

const MODEL = 'stories'

const { getItemList, getItem, getCurrentItemId } = modelSelectors(MODEL)
const { reverseUrl } = modelActions(MODEL)

const listFields = R.pipe(
  R.pick([
    'working_title',
    'publication_status',
    'story_type_name',
    'modified',
    'images',
  ]),
  R.assocPath(['modified', 'relative'], true) // relative time
)(detailFields)

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
    const data = getItem(pk)(state) || {}
    const { dirty, publication_status: status } = data
    const selected = getCurrentItemId(state) === pk
    const className = cx(`status-${status}`, 'TableCell', {
      dirty,
      selected,
      odd: row % 2,
    })
    return { className, model: MODEL }
  },
  (dispatch, { pk }) => ({ onClick: e => dispatch(reverseUrl({ id: pk })) })
)(TableRow)

const StoryTable = ({ items = [], fields = listFields }) => (
  <section className="StoryTable">
    {items.map((pk, index) => (
      <ConnectedTableRow key={pk} pk={pk} row={index} />
    ))}
  </section>
)
export default connect(state => ({ items: getItemList(state) }))(StoryTable)

import 'styles/storylist.scss'
import cx from 'classnames'
import { push } from 'redux-little-router'
import { connect } from 'react-redux'
import { detailFields } from 'stories/model'
import { modelSelectors } from 'ducks/basemodel'
import ModelField from 'components/ModelField'

const MODEL = 'stories'

const { getItemList, getItem, getCurrentItemId } = modelSelectors(MODEL)

const listFields = R.pipe(
  R.pick([
    'working_title',
    'publication_status',
    'story_type_name',
    'modified',
  ]),
  R.assocPath(['modified', 'relative'], true) // relative time
)(detailFields)

const renderFields = R.pipe(R.values, R.map(TableCell))

const TableCell = ({ editable, label, ...props }) => (
  <td key={props.name}>
    <ModelField editable={false} model={MODEL} {...props} />
  </td>
)

// render all headers in table
const TableRow = ({ pk, onClick, className = '', fields }) => (
  <tr key={pk} onClick={onClick} className={className}>
    {R.map(
      props => <TableCell pk={pk} key={props.name} {...props} />,
      R.values(listFields)
    )}
  </tr>
)

const ConnectedTableRow = connect(
  (state, { pk }) => {
    const data = getItem(pk)(state) || {}
    const { dirty, publication_status: status } = data
    const selected = getCurrentItemId(state) === pk
    const className = cx(`status-${status}`, 'TableRow', { dirty, selected })
    return { ...data, className, model: MODEL }
  },
  (dispatch, { pk }) => ({ onClick: e => dispatch(push(`/${MODEL}/${pk}`)) })
)(TableRow)

const StoryTable = ({ items = [], fields = listFields }) => (
  <table>
    <thead>
      <tr>
        {R.compose(
          R.values,
          R.map(({ name, label }) => <th key={name}>{label}</th>)
        )(fields)}
      </tr>
    </thead>
    <tbody>{items.map(pk => <ConnectedTableRow key={pk} pk={pk} />)}</tbody>
  </table>
)
export default connect(state => ({ items: getItemList(state) }))(StoryTable)

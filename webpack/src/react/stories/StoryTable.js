import 'styles/storylist.scss'
import cx from 'classnames'
import { push } from 'redux-little-router'
import { connect } from 'react-redux'
import { listFields } from 'stories/model'
import { modelSelectors } from 'ducks/basemodel'
import ModelField from 'components/ModelField'

const MODEL = 'stories'

const { getItemList, getItem, getCurrentItemId } = modelSelectors(MODEL)

// render all headers in table
const TableRow = ({ pk, onClick, className = '', fields }) => (
  <tr onClick={onClick} className={className}>
    {fields.map(({ key, editable, ...props }, i) => (
      <td key={i}>
        <ModelField
          editable={false}
          model={MODEL}
          pk={pk}
          relative={true}
          name={key}
          {...props}
        />
      </td>
    ))}
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
      <tr>{fields.map(({ key, label }) => <th key={key}>{label}</th>)}</tr>
    </thead>
    <tbody>
      {items.map(pk => <ConnectedTableRow key={pk} fields={fields} pk={pk} />)}
    </tbody>
  </table>
)
export default connect(state => ({ items: getItemList(state) }))(StoryTable)

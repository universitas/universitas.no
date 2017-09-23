import 'styles/storylist.scss'
import cx from 'classnames'
import { push } from 'redux-little-router'
import { connect } from 'react-redux'
import { detailFields, listFields } from 'stories/model'
import { modelSelectors } from 'ducks/basemodel'
import ModelField from 'components/ModelField'

const MODEL = 'stories'

const { getItemList, getItem, getCurrentItemId } = modelSelectors(MODEL)

// render all headers in table
const TableRow = ({ pk, onClick, className = '', fields }) => (
  <tr key={pk} onClick={onClick} className={className}>
    {R.compose(
      R.values,
      R.map(({ key, editable, ...props }) => (
        <td key={key}>
          <ModelField
            editable={false}
            model={MODEL}
            pk={pk}
            name={key}
            {...props}
          />
        </td>
      ))
    )(fields)}
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
          R.map(({ key, label }) => <th key={key}>{label}</th>)
        )(fields)}
      </tr>
    </thead>
    <tbody>
      {items.map(pk => <ConnectedTableRow fields={fields} pk={pk} />)}
    </tbody>
  </table>
)
export default connect(state => ({ items: getItemList(state) }))(StoryTable)

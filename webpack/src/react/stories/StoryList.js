import 'styles/storylist.scss'
import cx from 'classnames'
import { Link, push } from 'redux-little-router'
import { Clear } from 'components/Icons'
import { connect } from 'react-redux'
import { listFields as storyFields } from 'stories/model'
import { getDisplayName, formatDate, relativeDateTime } from 'utils/modelUtils'
import { modelSelectors, modelActions } from 'ducks/basemodel'
import SearchField from './SearchField'
import Navigation from './Navigation'
import Filter from './Filter'
import ModelField from 'components/ModelField'

const MODEL = 'stories'

const { filterToggled, filterSet, itemsRequested } = modelActions(MODEL)
const { getItemList, getItem, getCurrentItemId } = modelSelectors(MODEL)

// render all headers in table
let ListRow = ({
  pk,
  selected,
  publication_status,
  onClick,
  dirty,
  fields,
}) => (
  <tr
    className={cx({
      [`status-${publication_status}`]: true,
      ListRow: true,
      dirty,
      selected,
    })}
    onClick={onClick}
  >
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

ListRow = connect(
  (state, { pk }) => {
    const data = getItem(pk)(state) || {}
    const selected = getCurrentItemId(state) === pk
    return { ...data, selected }
  },
  (dispatch, { pk }) => ({
    onClick: e => dispatch(push(`/${MODEL}/${pk}`)),
  })
)(ListRow)

const filters = storyFields
  .filter(el => el.key === 'publication_status')[0]
  .choices.map(({ value, display_name }) => ({
    value: parseInt(value),
    label: display_name,
    toggle: true,
    attr: 'publication_status__in',
    model: MODEL,
  }))
  .filter(choice => choice.value < 10 || choice.value === 100)

filters.push({
  attr: 'publication_status__in',
  model: MODEL,
  value: [],
  label: <Clear />,
})

const StoryList = ({ items = [], fields = storyFields }) => {
  const headers = fields.map(({ key, label }) => <th key={key}>{label}</th>)
  const rows = items.map(pk => <ListRow key={pk} fields={fields} pk={pk} />)

  return (
    <div className="StoryList">
      <div className="ListBar">
        <div className="Filters">
          {filters.map((props, index) => <Filter key={index} {...props} />)}
          <SearchField label="søk i saker" attr="search" model={MODEL} />
        </div>
      </div>
      <table>
        <thead>
          <tr>{headers}</tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
      <div className="ListBar">
        <Navigation model={MODEL} />
      </div>
    </div>
  )
}
StoryList.propTypes = {
  items: PropTypes.array.isRequired,
  fields: PropTypes.array,
}
const mapStateToProps = (state, ownProps) => ({
  items: getItemList(state),
})
const mapDispatchToProps = (dispatch, ownProps) => ({})
export default connect(mapStateToProps, mapDispatchToProps)(StoryList)

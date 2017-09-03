import 'styles/storylist.scss'
import cx from 'classnames'
import { Link, push } from 'redux-little-router'
import { connect } from 'react-redux'
import {
  getQuery,
  getStoryList,
  getStory,
  getCurrentStoryId,
  filterToggled,
  getNavigation,
  storiesRequested,
} from 'stories/duck'
import { listFields as storyFields } from 'stories/model'
import { getDisplayName, formatDate, relativeDateTime } from 'utils/modelUtils'

// render all rows of results
const renderRows = (items, fields) =>
  items.map(id => <ListRow key={id} fields={fields} id={id} />)

// render all fields in a row
const renderFields = (fields, props) =>
  fields.map(({ key, ...args }) => (
    <TableField key={key} value={R.prop(key, props)} {...args} />
  ))

// render all headers in table
const renderHeaders = fields =>
  fields.map(({ key, label }) => <th key={key}>{label}</th>)

const TableField = ({ type, value, choices }) => {
  switch (type) {
    case 'date':
      return <td>{formatDate(value)}</td>
    case 'datetime':
      return <td>{relativeDateTime(value)}</td>
    case 'thumb':
      return (
        <td>
          <img style={{ height: '2em' }} className="thumb" src={value} />
        </td>
      )
    case 'choice':
      return <td>{getDisplayName(choices, value)}</td>
    default:
      return <td>{value}</td>
  }
}

let ListRow = ({ fields, onClick, ...props }) => (
  <tr
    className={cx({
      [`status-${props.publication_status}`]: true,
      ListRow: true,
      dirty: props.dirty,
      selected: props.selected,
    })}
    onClick={onClick}
  >
    {renderFields(fields, props)}
  </tr>
)

ListRow = connect(
  (state, { id }) => {
    const data = getStory(id)(state) || {}
    const selected = getCurrentStoryId(state) === id
    return { ...data, selected }
  },
  (dispatch, { id }) => ({
    onClick: e => dispatch(push(`/stories/${id}`)),
  })
)(ListRow)

const isFilterActive = (attr, value, query) => {
  const query_param = R.prop(attr, query)
  return R.type(query_param) === 'Array'
    ? R.contains(value, query_param)
    : R.equals(value, query_param)
}

const Filter = connect(state => ({ query: getQuery(state) }), {
  filterToggled,
})(({ query, label, attr, value, filterToggled }) => {
  const clickHandler = e => filterToggled(attr, value)
  const isActive = isFilterActive(attr, value, query)

  return (
    <button
      type="button"
      className={`Filter ${isActive ? 'active' : 'inactive'}`}
      onClick={clickHandler}
    >
      {label}
    </button>
  )
})

const getDate = () => new Date().toISOString().slice(0, 10)
const getYear = () => new Date().toISOString().slice(0, 4)

const status_choices = storyFields
  .filter(el => el.key === 'publication_status')[0]
  .choices.map(({ value, display_name }) => ({
    value: parseInt(value),
    label: display_name,
  }))
  .filter(choice => choice.value < 10 || choice.value === 100)

const StoryFilters = () => {
  return (
    <div className="Filters">
      {status_choices.map(props => (
        <Filter attr="publication_status" key={props.value} {...props} />
      ))}
    </div>
  )
}

let StoryNavigation = ({
  previous,
  next,
  results,
  last,
  count,
  offset,
  storiesRequested,
}) => {
  const info = (
    <div className="info">resultat {1 + last - results}–{last} av {count}</div>
  )
  if (!(previous || next)) {
    return info
  }
  const nextItems = () => storiesRequested(next)
  const prevItems = () => storiesRequested(previous)
  return (
    <div className="Navigation">
      {info}
      <button onClick={prevItems} disabled={!previous} title={previous}>
        bakover
      </button>
      <button onClick={nextItems} disabled={!next} title={next}>
        fremover
      </button>
    </div>
  )
}
StoryNavigation = connect(getNavigation, { storiesRequested })(StoryNavigation)

const StoryList = ({ items = [], fields = storyFields }) => {
  return (
    <div className="StoryList">
      <div className="ListBar">
        <StoryFilters />
      </div>
      <table>
        <thead>
          <tr>{renderHeaders(fields)}</tr>
        </thead>
        <tbody>
          {renderRows(items, fields)}
        </tbody>
      </table>
      <div className="ListBar">
        <StoryNavigation />
      </div>
    </div>
  )
}
StoryList.propTypes = {
  items: PropTypes.array.isRequired,
  fields: PropTypes.array,
}
const mapStateToProps = (state, ownProps) => ({
  items: getStoryList(state),
})
const mapDispatchToProps = (dispatch, ownProps) => ({})
export default connect(mapStateToProps, mapDispatchToProps)(StoryList)

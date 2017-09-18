import 'styles/storylist.scss'
import cx from 'classnames'
import { Link, push } from 'redux-little-router'
import { Clear } from 'components/Icons'
import { connect } from 'react-redux'
import { listFields as storyFields } from 'stories/model'
import { getDisplayName, formatDate, relativeDateTime } from 'utils/modelUtils'
import { modelSelectors, modelActions } from 'ducks/basemodel'

const { filterToggled, filterSet, itemsRequested } = modelActions('stories')
const {
  getQuery,
  getItemList,
  getItem,
  getCurrentItemId,
  getNavigation,
} = modelSelectors('stories')

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
    const data = getItem(id)(state) || {}
    const selected = getCurrentItemId(state) === id
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
  filterSet,
})(({ query, label, attr, value, toggle = true, filterSet, filterToggled }) => {
  const clickHandler = toggle
    ? e => filterToggled(attr, value)
    : e => filterSet(attr, value)
  const isActive = isFilterActive(attr, value, query)
  const disabled = toggle ? false : isActive

  return (
    <button
      type="button"
      className={`Filter ${isActive ? 'active' : 'inactive'}`}
      disabled={disabled}
      onClick={clickHandler}
    >
      {label}
    </button>
  )
})
let SearchBar = ({
  value = '',
  label = 'search',
  attr = 'search',
  filterSet,
}) => (
  <input
    className="SearchBar"
    type="text"
    onChange={e => filterSet(attr, e.target.value)}
    placeholder={label}
    value={value}
  />
)
SearchBar = connect(
  (state, { attr = 'search' }) => ({ value: R.prop(attr, getQuery(state)) }),
  { filterSet }
)(SearchBar)

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
      <Filter
        attr="publication_status__in"
        value={[]}
        toggle={false}
        label={<Clear />}
      />
      {status_choices.map(props => (
        <Filter attr="publication_status__in" key={props.value} {...props} />
      ))}
      <SearchBar label="søk i saker" attr="search" />
      <Filter attr="search" value="" toggle={false} label={<Clear />} />
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
  itemsRequested,
}) => {
  const info = (
    <div className="info">resultat {1 + last - results}–{last} av {count}</div>
  )
  if (!(previous || next)) {
    return info
  }
  const nextItems = () => itemsRequested(next)
  const prevItems = () => itemsRequested(previous)
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
StoryNavigation = connect(getNavigation, { itemsRequested })(StoryNavigation)

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
  items: getItemList(state),
})
const mapDispatchToProps = (dispatch, ownProps) => ({})
export default connect(mapStateToProps, mapDispatchToProps)(StoryList)

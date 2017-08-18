import R from 'ramda'
import React from 'react'
import PropTypes from 'prop-types'
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
import { getDisplayName, formatDate, formatDateTime } from 'utils/modelUtils'

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
      return <td>{formatDateTime(value)}</td>
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
    style={{
      color: props.dirty ? '#888' : 'inherit',
      fontWeight: props.selected ? 'bold' : 'normal',
      cursor: 'pointer',
    }}
    className="ListRow"
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

const Button = connect(state => ({ query: getQuery(state) }), {
  filterToggled,
})(({ query, label, attr, value, filterToggled }) => {
  const clickHandler = e => filterToggled(attr, value)
  const isActive = R.propEq(attr, value, query)

  return (
    <button
      type="button"
      className={`small button ${isActive ? 'primary' : 'secondary'}`}
      onClick={clickHandler}
    >
      {label}
    </button>
  )
})

const getDate = () => new Date().toISOString().slice(0, 10)
const getYear = () => new Date().toISOString().slice(0, 4)

const StoryFilters = () => {
  return (
    <div>
      <Button attr="limit" value="5" label="limit 5" />
    </div>
  )
}

let StoryNavigation = ({ previous, next, storiesRequested }) => {
  const nextItems = () => storiesRequested(next)
  const prevItems = () => storiesRequested(previous)
  return (
    <div>
      <button
        className="small button"
        onClick={prevItems}
        disabled={!previous}
        title={previous}
      >
        previous
      </button>
      <button
        className="small button"
        onClick={nextItems}
        disabled={!next}
        title={next}
      >
        next
      </button>
    </div>
  )
}
StoryNavigation = connect(getNavigation, { storiesRequested })(StoryNavigation)

const StoryList = ({ items = [], fields = storyFields }) => {
  return (
    <div className="IssueList">
      <StoryFilters />
      <StoryNavigation next="foo" previous="bar" />
      <table>
        <thead>
          <tr>{renderHeaders(fields)}</tr>
        </thead>
        <tbody>
          {renderRows(items, fields)}
        </tbody>
      </table>
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

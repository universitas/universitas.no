import R from 'ramda'
import React from 'react'
import PropTypes from 'prop-types'
import { Link, push } from 'redux-little-router'
import { connect } from 'react-redux'
import {
  getQuery,
  getIssueList,
  getIssue,
  getCurrentIssueId,
  filterToggled,
} from 'issues/duck'
import { fields as issueFields } from 'issues/model'
import { getDisplayName, formatDate } from 'utils/modelUtils'

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
    title={R.toString(props)}
    className="ListRow"
    onClick={onClick}
  >
    {renderFields(fields, props)}
  </tr>
)

ListRow = connect(
  (state, { id }) => {
    const data = getIssue(id)(state) || {}
    const selected = getCurrentIssueId(state) === id
    return { ...data, selected }
  },
  (dispatch, { id }) => ({ onClick: e => dispatch(push(`/issues/${id}`)) })
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

const IssueFilters = () => {
  const year = getYear()
  const date = getDate()
  return (
    <div>
      <Button attr="publication_date__year" value={year} label={year} />
      <Button attr="publication_date__gte" value={date} label="upcoming" />
    </div>
  )
}

const IssueList = ({ items = [], fields = issueFields }) => {
  return (
    <div className="IssueList">
      <IssueFilters />

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
IssueList.propTypes = {
  items: PropTypes.array.isRequired,
  fields: PropTypes.array,
}
const mapStateToProps = (state, ownProps) => ({
  items: getIssueList(state),
})
const mapDispatchToProps = (dispatch, ownProps) => ({})
export default connect(mapStateToProps, mapDispatchToProps)(IssueList)

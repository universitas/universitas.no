import R from 'ramda'
import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'redux-little-router'
import { connect } from 'react-redux'
import { getIssueList, getIssue } from 'issues/duck'
import { fields as issueFields } from 'issues/model'
import { getDisplayName, formatDate } from 'utils/modelUtils'

// render all rows of results
const renderRows = (items, fields) =>
  items.map(id => <ListItem key={id} fields={fields} id={id} />)

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

let ListItem = ({ fields, id, ...props }) => (
  <Link href={`/issues/${id}`}>
    <tr className="ListItem">
      {renderFields(fields, props)}
    </tr>
  </Link>
)

ListItem = connect((state, { id }) => getIssue(id)(state) || {})(ListItem)

const IssueList = ({ items = [], fields = issueFields }) => {
  return (
    <table className="IssueList">
      <thead>
        <tr>{renderHeaders(fields)}</tr>
      </thead>
      <tbody>
        {renderRows(items, fields)}
      </tbody>
    </table>
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

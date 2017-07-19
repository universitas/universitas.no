import R from 'ramda'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getIssueList, getIssue } from 'ducks/issues'
import imgdata from 'placeholderImage'

const renderRows = (items, fields) =>
  items.map(id => <ListItem key={id} fields={fields} id={id} />)

const renderFields = (fields, props) =>
  fields.map(field => <td key={field}>{props[field]}</td>)
const renderHeaders = fields =>
  fields.map((label, key) => <th key={key}>{label}</th>)

let ListItem = ({ fields, ...props }) => (
  <tr className="ListItem">
    {renderFields(fields, props)}
  </tr>
)

ListItem = connect((state, { id }) => getIssue(id)(state) || {})(ListItem)

const issueFields = ['year', 'number', 'get_issue_type_display']

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

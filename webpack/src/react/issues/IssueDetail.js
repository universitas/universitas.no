import R from 'ramda'
import React from 'react'
import { connect } from 'react-redux'
import { getCurrentIssue } from 'issues/duck'

const PdfPreview = ({ cover_page, pdf }) => (
  <a href={pdf}>
    <img className="PdfPreview" src={cover_page} alt="pdf" />
  </a>
)

const IssueDetail = ({
  id,
  publication_date,
  year,
  number,
  pdfs = [],
  get_issue_type_display,
}) => (
  <div>
    <div>{publication_date}</div>
    <div>{number}/{year}</div>
    <div>{get_issue_type_display}</div>
    <div>{pdfs.map(props => <PdfPreview key={props.url} {...props} />)}</div>
  </div>
)

export default connect(getCurrentIssue)(IssueDetail)

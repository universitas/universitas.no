import { connect } from 'react-redux'
import cx from 'classnames'
import { IssueTools } from '.'
import { MODEL, Field } from './model.js'
import DetailPanel from 'components/DetailPanel'

const IssueDetail = ({ pk, action }) => (
  <DetailPanel
    pk={pk}
    model={MODEL}
    getTitle={issue => `Utgave ${issue.issue_name}`}
  >
    <Field pk={pk} name="issue_type" />
    <Field pk={pk} name="publication_date" />
    <Field pk={pk} name="pdfs" />
  </DetailPanel>
)

export default IssueDetail

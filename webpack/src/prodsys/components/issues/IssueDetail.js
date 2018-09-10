import { connect } from 'react-redux'
import cx from 'classnames'
import { IssueTools } from '.'
import { Field } from './model.js'

const IssueDetail = ({ pk, action }) => (
  <section className="DetailPanel">
    <IssueTools pk={pk} action={action} />
    <div className="panelContent">
      <Field pk={pk} name="issue_type" />
      <Field pk={pk} name="publication_date" />
      <Field pk={pk} name="pdfs" />
    </div>
  </section>
)

export default IssueDetail

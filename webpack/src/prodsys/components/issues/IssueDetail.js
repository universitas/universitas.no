import { connect } from 'react-redux'
import ModelField from 'components/ModelField'
import cx from 'classnames'
import { IssueTools } from '.'
import { fields, MODEL, selectors } from './model.js'

const Field = ({ name, ...props }) => (
  <ModelField
    key={name}
    name={name}
    model={MODEL}
    {...fields[name]}
    {...props}
  />
)

const IssueDetail = ({ pk }) => (
  <section className="DetailPanel">
    <IssueTools pk={pk} />
    <div className="panelContent">
      <Field pk={pk} name="issue_type" />
      <Field pk={pk} name="publication_date" />
      <Field pk={pk} name="pdfs" />
    </div>
  </section>
)

export default connect(R.applySpec({ pk: selectors.getCurrentItemId }))(
  IssueDetail,
)

import { connect } from 'react-redux'
import { detailFields as fields } from 'issues/model'
import IssueTools from 'issues/IssueTools'
import ModelField from 'components/ModelField'
import { modelSelectors } from 'ducks/basemodel'
import cx from 'classnames'

const model = 'issues'

const Field = ({ label, type, ...props }) => (
  <div className={cx('DetailField', type)}>
    <span className="label">{label}: </span>
    <ModelField className="Field" type={type} {...props} />
  </div>
)

const IssueDetail = ({ pk }) => (
  <section className="DetailPanel">
    <IssueTools pk={pk} />
    <div className="panelContent">
      <Field {...{ pk, model, ...fields.issue_name }} />
      <Field {...{ pk, model, ...fields.issue_type }} />
      <Field {...{ pk, model, ...fields.publication_date }} />
      <Field {...{ pk, model, ...fields.pdfs }} />
    </div>
  </section>
)

const { getCurrentItemId: pk } = modelSelectors(model)
export default connect(R.applySpec({ pk }))(IssueDetail)

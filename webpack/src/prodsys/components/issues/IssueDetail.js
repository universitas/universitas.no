import { connect } from 'react-redux'
import ModelField from 'components/ModelField'
import cx from 'classnames'
import { IssueTools } from '.'
import { fields, MODEL, selectors } from './model.js'

const IssueDetail = ({ pk }) => (
  <section className="DetailPanel">
    <IssueTools pk={pk} />
    <div className="panelContent">
      <ModelField {...{ pk, model: MODEL, ...fields.issue_type }} />
      <ModelField {...{ pk, model: MODEL, ...fields.publication_date }} />
      <ModelField {...{ pk, model: MODEL, ...fields.pdfs }} />
    </div>
  </section>
)

export default connect(R.applySpec({ pk: selectors.getCurrentItemId }))(
  IssueDetail,
)

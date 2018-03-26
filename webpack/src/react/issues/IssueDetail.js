import { connect } from 'react-redux'
import { detailFields as fields } from 'issues/model'
import IssueTools from 'issues/IssueTools'
import ModelField from 'components/ModelField'
import { modelSelectors } from 'ducks/basemodel'
import cx from 'classnames'

const model = 'issues'

const IssueDetail = ({ pk }) => (
  <section className="DetailPanel">
    <IssueTools pk={pk} />
    <div className="panelContent">
      <ModelField {...{ pk, model, ...fields.issue_name }} />
      <ModelField {...{ pk, model, ...fields.issue_type }} />
      <ModelField {...{ pk, model, ...fields.publication_date }} />
      <ModelField {...{ pk, model, ...fields.pdfs }} />
    </div>
  </section>
)

const { getCurrentItemId: pk } = modelSelectors(model)
export default connect(R.applySpec({ pk }))(IssueDetail)

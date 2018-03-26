import { connect } from 'react-redux'
import { detailFields as fields } from 'contributors/model'
import ContributorTools from 'contributors/ContributorTools'
import ModelField from 'components/ModelField'
import { modelSelectors } from 'ducks/basemodel'
import cx from 'classnames'

const model = 'contributors'

const ContributorDetail = ({ pk }) => (
  <section className="DetailPanel">
    <ContributorTools pk={pk} />
    <div className="panelContent">
      <ModelField {...{ pk, model, ...fields.display_name }} />
      <ModelField {...{ pk, model, ...fields.status }} />
      <ModelField {...{ pk, model, ...fields.email }} />
      <ModelField {...{ pk, model, ...fields.phone }} />
      <ModelField {...{ pk, model, ...fields.thumb }} />
      <ModelField {...{ pk, model, ...fields.stint_set }} />
    </div>
  </section>
)

const { getCurrentItemId: pk } = modelSelectors(model)
export default connect(R.applySpec({ pk }))(ContributorDetail)

import { connect } from 'react-redux'
import { detailFields as fields } from 'contributors/model'
import ContributorTools from 'contributors/ContributorTools'
import ModelField from 'components/ModelField'
import { modelSelectors } from 'ducks/basemodel'
import cx from 'classnames'

const model = 'contributors'

const Field = ({ label, type, ...props }) => (
  <div className={cx('DetailField', type)}>
    <span className="label">{label}: </span>
    <ModelField className="Field" type={type} {...props} />
  </div>
)

const ContributorDetail = ({ pk }) => (
  <section className="DetailPanel">
    <ContributorTools pk={pk} />
    <div className="panelContent">
      <Field {...{ pk, model, ...fields.display_name }} />
      <Field {...{ pk, model, ...fields.status }} />
      <Field {...{ pk, model, ...fields.email }} />
      <Field {...{ pk, model, ...fields.phone }} />
      <Field {...{ pk, model, ...fields.thumb }} />
      <Field {...{ pk, model, ...fields.stint_set }} />
    </div>
  </section>
)

const { getCurrentItemId: pk } = modelSelectors(model)
export default connect(R.applySpec({ pk }))(ContributorDetail)

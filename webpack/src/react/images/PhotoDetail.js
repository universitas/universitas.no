import { connect } from 'react-redux'
import { detailFields as fields } from 'images/model'
import PhotoTools from 'images/PhotoTools'
import ModelField from 'components/ModelField'
import { modelSelectors } from 'ducks/basemodel'

const model = 'images'

const Field = ({ label, type, ...props }) => (
  <div className={`DetailField ${type}`}>
    <span className="label">{label}: </span>
    <ModelField className="Field" type={type} {...props} />
  </div>
)

const PhotoDetail = ({ pk }) => (
  <section className="DetailPanel">
    <PhotoTools pk={pk} />
    <div className="panelContent">
      <Field {...{ pk, model, ...fields.name }} />
      <Field {...{ pk, model, ...fields.large }} />
      <Field {...{ pk, model, ...fields.original }} />
      <Field {...{ pk, model, ...fields.description }} />
      <Field {...{ pk, model, ...fields.usage }} />
      <Field {...{ pk, model, ...fields.created }} />
      <Field {...{ pk, model, ...fields.size }} />
    </div>
  </section>
)

const { getCurrentItemId: pk } = modelSelectors(model)
export default connect(R.applySpec({ pk }))(PhotoDetail)

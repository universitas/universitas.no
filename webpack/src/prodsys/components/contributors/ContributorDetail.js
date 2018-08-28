import cx from 'classnames'
import { connect } from 'react-redux'
import { ContributorTools } from '.'
import ModelField from 'components/ModelField'
import { fields, selectors, MODEL } from './model.js'

const Field = ({ name, ...props }) => (
  <ModelField
    key={name}
    name={name}
    model={MODEL}
    {...fields[name]}
    {...props}
  />
)

const ContributorDetail = ({ pk }) => {
  const props = { pk, model: MODEL }
  return (
    <section className="DetailPanel" key={pk}>
      <ContributorTools pk={pk} />
      <div className="panelContent">
        <Field pk={pk} name="display_name" />
        <Field pk={pk} name="status" />
        <Field pk={pk} name="email" />
        <Field pk={pk} name="phone" />
        <Field pk={pk} name="thumb" />
        <Field pk={pk} name="byline_photo" />
        <Field pk={pk} name="stint_set" />
      </div>
    </section>
  )
}

export default connect(R.applySpec({ pk: selectors.getCurrentItemId }))(
  ContributorDetail,
)

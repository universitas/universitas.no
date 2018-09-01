import { connect } from 'react-redux'
import ModelField from 'components/ModelField'
import cx from 'classnames'
import { FrontpageTools } from '.'
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

const FrontpageDetail = ({ pk }) => (
  <section className="DetailPanel" key={pk} style={{ maxWidth: '30rem' }}>
    <FrontpageTools pk={pk} />
    <div className="panelContent">
      <Field pk={pk} name="vignette" />
      <Field pk={pk} name="kicker" />
      <Field pk={pk} name="headline" />
      <Field pk={pk} name="lede" />
      <Field pk={pk} name="columns" />
      <Field pk={pk} name="rows" />
      <Field pk={pk} name="priority" />
      <Field pk={pk} name="imagefile" />
    </div>
  </section>
)

export default connect(R.applySpec({ pk: selectors.getCurrentItemId }))(
  FrontpageDetail,
)

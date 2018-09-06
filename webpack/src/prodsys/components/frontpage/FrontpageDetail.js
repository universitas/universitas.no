import { connect } from 'react-redux'
import ModelField from 'components/ModelField'
import cx from 'classnames'
import { FrontpageTools } from '.'
import { fields, MODEL, selectors, actions } from './model.js'
import StyleButtons from './StyleButtons.js'

const Field = ({ name, ...props }) => (
  <ModelField
    key={name}
    name={name}
    model={MODEL}
    {...fields[name]}
    {...props}
  />
)

const FrontpageDetail = ({ pk, fieldChanged }) => (
  <section className="DetailPanel" key={pk} style={{ maxWidth: '30rem' }}>
    <FrontpageTools pk={pk} />
    <div className="panelContent">
      {pk ? (
        <React.Fragment>
          <Field pk={pk} name="vignette" />
          <Field pk={pk} name="kicker" />
          <Field pk={pk} name="headline" />
          <Field pk={pk} name="lede" />
          <Field pk={pk} name="priority" />
          <Field pk={pk} name="imagefile" />
          <Field pk={pk} name="size" />
          <StyleButtons pk={pk} />
        </React.Fragment>
      ) : (
        <div>velg en sak</div>
      )}
    </div>
  </section>
)

export default connect(R.applySpec({ pk: selectors.getCurrentItemId }))(
  FrontpageDetail,
)

import cx from 'classnames'
import { connect } from 'react-redux'
import { ContributorTools } from '.'
import { Field, selectors } from './model.js'

const ContributorDetail = ({ pk, action }) => (
  <section className="DetailPanel">
    <ContributorTools pk={pk} action={action} />
    <div className="panelContent">
      <Field pk={pk} name="thumb" label="" />
      <Field pk={pk} name="byline_photo" editable key={pk} />
      <Field pk={pk} name="display_name" editable />
      <Field pk={pk} name="email" editable />
      <Field pk={pk} name="phone" editable />
      <Field pk={pk} name="status" editable />
      <Field pk={pk} name="stint_set" />
    </div>
  </section>
)

export default ContributorDetail

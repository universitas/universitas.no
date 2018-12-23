import DetailPanel from 'components/DetailPanel'
import cx from 'classnames'
import { connect } from 'react-redux'
import { MODEL, Field, selectors } from './model.js'

const ContributorCreate = ({ pk, action }) =>
  action != 'create' ? null : (
    <DetailPanel pk={0} model={MODEL} getTitle={R.prop('display_name')}>
      <Field pk={0} name="display_name" editable />
      <Field pk={0} name="email" editable />
      <Field pk={0} name="phone" editable />
      <Field pk={0} name="first_position" editable />
      <Field pk={0} name="status" editable />
    </DetailPanel>
  )

export default ContributorCreate

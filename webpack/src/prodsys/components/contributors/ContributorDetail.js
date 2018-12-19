import DetailPanel from 'components/DetailPanel'
import cx from 'classnames'
import { connect } from 'react-redux'
import { MODEL, Field, selectors } from './model.js'

const ContributorDetail = ({ pk, action }) => (
  <DetailPanel pk={pk} model={MODEL} getTitle={R.prop('display_name')}>
    <Field pk={pk} name="thumb" label="" />
    <Field pk={pk} name="byline_photo" editable key={pk} />
    <Field pk={pk} name="display_name" editable />
    <Field pk={pk} name="email" editable />
    <Field pk={pk} name="phone" editable />
    <Field pk={pk} name="status" editable />
    <Field pk={pk} name="stint_set" />
  </DetailPanel>
)

export default ContributorDetail

import DetailPanel from 'components/DetailPanel'
import cx from 'classnames'
import { connect } from 'react-redux'
import { formatDate } from 'utils/text.js'
import { MODEL, Field, selectors } from './model.js'

const getTitle = R.pipe(
  R.prop('publication_date'),
  formatDate,
  R.concat('Utgave '),
)

const IssueCreate = ({ pk, action }) =>
  action != 'create' ? null : (
    <DetailPanel pk={0} model={MODEL} getTitle={getTitle}>
      <Field pk={0} name="publication_date" editable />
      <Field pk={0} name="issue_type" editable />
    </DetailPanel>
  )

export default IssueCreate

import 'styles/storylist.scss'
import cx from 'classnames'
import { Clear } from 'components/Icons'
import { connect } from 'react-redux'
import { detailFields } from 'issues/model'
import IssueGrid from 'issues/IssueGrid'
import ListPanel from 'containers/ListPanel'

const MODEL = 'issues'

const filters = [
  { toggle: true, attr: 'limit', model: MODEL, value: 5, label: 'limit 5' },
  { toggle: true, attr: 'limit', model: MODEL, value: 10, label: 'limit 10' },
]

const IssueList = ({ model = MODEL }) => {
  return (
    <ListPanel model={MODEL} filters={filters}>
      <IssueGrid />
    </ListPanel>
  )
}
export default IssueList

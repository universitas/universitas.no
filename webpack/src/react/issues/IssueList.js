import 'styles/storylist.scss'
import cx from 'classnames'
import { Clear } from 'components/Icons'
import { connect } from 'react-redux'
import { detailFields } from 'issues/model'
import IssueGrid from 'issues/IssueGrid'
import ListPanel from 'containers/ListPanel'

const MODEL = 'issues'
const date = new Date().toISOString().slice(0, 10)
const year = new Date().toISOString().slice(0, 4)

const filters = [
  {
    toggle: true,
    attr: 'publication_date__year',
    model: MODEL,
    value: year,
    label: year,
  },
  {
    toggle: true,
    attr: 'publication_date__gte',
    model: MODEL,
    value: date,
    label: 'kommende',
  },
]

const IssueList = ({ model = MODEL }) => {
  return (
    <ListPanel model={MODEL} filters={filters}>
      <IssueGrid />
    </ListPanel>
  )
}
export default IssueList

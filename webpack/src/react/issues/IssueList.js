import 'styles/storylist.scss'
import cx from 'classnames'
import { Clear } from 'components/Icons'
import { connect } from 'react-redux'
import { detailFields } from 'issues/model'
import IssueGrid from 'issues/IssueGrid'
import ListPanel from 'containers/ListPanel'

const MODEL = 'issues'
const month = parseInt(new Date().toISOString().slice(5, 7))
let year = parseInt(new Date().toISOString().slice(0, 4))
if (month > 10) year += 1

const filters = [
  {
    toggle: true,
    attr: 'publication_date__year',
    model: MODEL,
    value: year - 2,
    label: year - 2,
  },
  {
    toggle: true,
    attr: 'publication_date__year',
    model: MODEL,
    value: year - 1,
    label: year - 1,
  },
  {
    toggle: true,
    attr: 'publication_date__year',
    model: MODEL,
    value: year,
    label: year,
  },
  {
    toggle: true,
    attr: 'ordering',
    model: MODEL,
    value: 'publication_date',
    label: 'eldste først',
  },
]

const IssueList = ({ model = MODEL }) => {
  return (
    <ListPanel model={MODEL} filters={filters} className={cx('ItemGrid')}>
      <IssueGrid />
    </ListPanel>
  )
}
export default IssueList

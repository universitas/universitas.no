import 'styles/storylist.scss'
import cx from 'classnames'
import { Clear } from 'components/Icons'
import { connect } from 'react-redux'
import { detailFields } from 'contributors/model'
import ContributorGrid from 'contributors/ContributorGrid'
import ListPanel from 'containers/ListPanel'

const MODEL = 'contributors'

const filters = R.map(R.merge({ toggle: true, model: MODEL }), [
  { attr: 'byline_photo__isnull', value: 0, label: 'med foto' },
  { attr: 'byline_photo__isnull', value: 1, label: 'uten foto' },
  { attr: 'status', value: 1, label: 'aktiv' },
  { attr: 'status', value: 2, label: 'slutta' },
  { attr: 'status', value: 3, label: 'ekstern' },
])

const ContributorList = ({ model = MODEL }) => {
  return (
    <ListPanel model={MODEL} filters={filters}>
      <ContributorGrid />
    </ListPanel>
  )
}
export default ContributorList

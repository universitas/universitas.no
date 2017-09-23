import 'styles/storylist.scss'
import cx from 'classnames'
import { Clear } from 'components/Icons'
import { connect } from 'react-redux'
import { listFields } from 'stories/model'
import StoryTable from 'stories/StoryTable'
import ListPanel from 'containers/ListPanel'

const MODEL = 'stories'

const filters = listFields.publication_status.choices
  .map(({ value, display_name }) => ({
    value: parseInt(value),
    label: display_name,
    toggle: true,
    attr: 'publication_status__in',
    model: MODEL,
  }))
  .filter(choice => choice.value < 10 || choice.value === 100)

filters.push({
  attr: 'publication_status__in',
  model: MODEL,
  value: [],
  label: <Clear />,
})

const StoryList = ({ model = MODEL }) => {
  return (
    <ListPanel model={MODEL} filters={filters}>
      <StoryTable />
    </ListPanel>
  )
}
export default StoryList

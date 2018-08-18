import cx from 'classnames'
import { Clear } from 'components/Icons'
import ListPanel from 'components/ListPanel'
import { StoryTable } from '.'
import { MODEL, fields } from './model.js'

const filters = fields.publication_status.choices
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
filters.push({
  toggle: true,
  attr: 'ordering',
  model: MODEL,
  value: '-modified',
  label: 'sist endret',
})

const StoryList = ({}) => {
  return (
    <ListPanel model={MODEL} filters={filters}>
      <StoryTable />
    </ListPanel>
  )
}
export default StoryList

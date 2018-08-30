import cx from 'classnames'
import { Clear } from 'components/Icons'
import ListPanel from 'components/ListPanel'
import { StoryTable } from '.'
import { MODEL, fields } from './model.js'

const flattenOptions = options => {
  const retval = []
  for (const option of options) {
    if (option.options) retval.push(...flattenOptions(option.options))
    else retval.push(option)
  }
  return retval
}

const filters = R.pipe(
  R.path(['publication_status', 'options']),
  flattenOptions,
  R.map(({ value, label }) => ({
    value: parseInt(value),
    label,
    toggle: true,
    attr: 'publication_status__in',
    model: MODEL,
  })),
  R.filter(({ value }) => value < 10 || value === 100),
  R.append({
    attr: 'publication_status__in',
    model: MODEL,
    value: [],
    label: <Clear />,
  }),
  R.append({
    toggle: true,
    attr: 'ordering',
    model: MODEL,
    value: '-modified',
    label: 'sist endret',
  }),
)(fields)

const StoryList = ({}) => {
  return (
    <ListPanel model={MODEL} filters={filters}>
      <StoryTable />
    </ListPanel>
  )
}
export default StoryList

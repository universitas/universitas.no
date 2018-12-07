import cx from 'classnames'
import { Clear } from 'components/Icons'
import ListPanel from 'components/ListPanel'
import { StoryTable, StoryDetailPreview } from '.'
import { PhotoList } from 'components/photos'
import { MODEL, fields } from './model.js'

const filters = R.pipe(
  R.path(['publication_status', 'options']),
  R.map(({ label, options }) => ({
    label,
    value: R.pluck('value', options),
    attr: 'publication_status__in',
    model: MODEL,
    toggle: true,
    title: 'kategori: ' + R.join(', ', R.pluck('label', options)),
  })),
  R.append({
    toggle: true,
    attr: 'ordering',
    model: MODEL,
    value: '-modified',
    label: 'sist endret',
  }),
)(fields)

const StoryList = ({ action, pk }) => {
  if (pk && action == 'images')
    return (
      <React.Fragment>
        <ListPanel model={MODEL} filters={filters}>
          <StoryTable />
        </ListPanel>
        <PhotoList action={action} />
      </React.Fragment>
    )
  if (pk && action == 'preview') return <StoryDetailPreview pk={pk} />
  return (
    <ListPanel model={MODEL} filters={filters}>
      <StoryTable />
    </ListPanel>
  )
}
export default StoryList

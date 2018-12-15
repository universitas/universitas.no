import ListPanel from 'components/ListPanel'
import PhotoGrid from './PhotoGrid.js'
import { MODEL } from './model.js'

const filters = R.map(R.merge({ toggle: true, model: MODEL }))([
  { attr: 'limit', value: 16, label: '16' },
  { attr: 'limit', value: 50, label: '50' },
  { attr: 'limit', value: 150, label: '150' },
  { attr: 'category', value: 1, label: 'foto' },
  { attr: 'category', value: 2, label: 'illustrasjon' },
  { attr: 'category', value: 3, label: 'diagram' },
  { attr: 'category', value: 4, label: 'bylinebilde' },
  { attr: 'category', value: 5, label: 'ekstern' },
  { attr: 'category', value: 0, label: 'ukjent' },
  { attr: 'ordering', value: '-modified', label: 'sist endret' },
])

const PhotoList = ({ selected = [], action }) => {
  return (
    <ListPanel model={MODEL} filters={filters}>
      <PhotoGrid selected={selected} action={action} />
    </ListPanel>
  )
}
export default PhotoList

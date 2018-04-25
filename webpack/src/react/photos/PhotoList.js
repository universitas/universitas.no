import 'styles/storylist.scss'
import cx from 'classnames'
import { Clear } from 'components/Icons'
import { connect } from 'react-redux'
import { detailFields } from 'photos/model'
import PhotoGrid from 'photos/PhotoGrid'
import ListPanel from 'containers/ListPanel'

const MODEL = 'photos'

const category = { toggle: true, attr: 'category', model: MODEL }

const filters = [
  { toggle: true, attr: 'limit', model: MODEL, value: 16, label: '16' },
  { toggle: true, attr: 'limit', model: MODEL, value: 50, label: '50' },
  { toggle: true, attr: 'limit', model: MODEL, value: 150, label: '150' },
  { ...category, value: 1, label: 'foto' },
  { ...category, value: 2, label: 'illustrasjon' },
  { ...category, value: 3, label: 'diagram' },
  { ...category, value: 4, label: 'bylinebilde' },
  { ...category, value: 5, label: 'ekstern' },
  { ...category, value: 0, label: 'ukjent' },
  {
    toggle: true,
    attr: 'ordering',
    model: MODEL,
    value: '-modified',
    label: 'sist endret',
  },
]

const PhotoList = ({ model = MODEL }) => {
  return (
    <ListPanel model={MODEL} filters={filters}>
      <PhotoGrid />
    </ListPanel>
  )
}
export default PhotoList

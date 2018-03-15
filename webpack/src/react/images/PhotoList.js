import 'styles/storylist.scss'
import cx from 'classnames'
import { Clear } from 'components/Icons'
import { connect } from 'react-redux'
import { detailFields } from 'images/model'
import PhotoGrid from 'images/PhotoGrid'
import ListPanel from 'containers/ListPanel'

const MODEL = 'images'

const filters = [
  { toggle: true, attr: 'limit', model: MODEL, value: 25, label: '25' },
  { toggle: true, attr: 'limit', model: MODEL, value: 50, label: '50' },
  { toggle: true, attr: 'limit', model: MODEL, value: 75, label: '75' },
]

const PhotoList = ({ model = MODEL }) => {
  return (
    <ListPanel model={MODEL} filters={filters}>
      <PhotoGrid />
    </ListPanel>
  )
}
export default PhotoList

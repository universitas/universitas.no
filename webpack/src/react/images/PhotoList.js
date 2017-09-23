import 'styles/storylist.scss'
import cx from 'classnames'
import { Clear } from 'components/Icons'
import { connect } from 'react-redux'
import { detailFields } from 'images/model'
import PhotoGrid from 'images/PhotoGrid'
import ListPanel from 'containers/ListPanel'

const MODEL = 'images'

const filters = [
  { toggle: true, attr: 'limit', model: MODEL, value: 5, label: 'limit 5' },
  { toggle: true, attr: 'limit', model: MODEL, value: 10, label: 'limit 10' },
]

const PhotoList = ({ model = MODEL }) => {
  return (
    <ListPanel model={MODEL} filters={filters}>
      <PhotoGrid />
    </ListPanel>
  )
}
export default PhotoList

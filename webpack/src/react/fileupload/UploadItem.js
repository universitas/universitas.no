import { connect } from 'react-redux'
import { getUpload } from 'ducks/fileupload'
import ImageData from 'components/ImageData'
import Duplicate from './Duplicate'
import UploadActions from './UploadActions'
import UploadForm from './UploadForm'

const UploadItem = ({ small, pk, ...props }) => (
  <div className="UploadItem">
    <UploadActions pk={pk} />
    <ImageData thumb={small} {...props} />
    <UploadForm pk={pk} />
    <Duplicates {...props} pk={pk} />
  </div>
)

const Loading = () => <small>sjekker for duplikater</small>
const NoDupes = () => <small>ingen duplikater</small>
const Uploaded = () => <small>Bildet ble lastet opp</small>

const Duplicates = ({ duplicates, pk, status }) => {
  if (status == 'uploaded') return <Uploaded />
  if (R.isNil(duplicates)) return <Loading />
  if (R.isEmpty(duplicates)) return <NoDupes />
  return (
    <div className="Duplicates">
      <small>Bildet er lastet opp fra før</small>
      {R.map(({ id, choice }) => (
        <Duplicate key={id} id={id} choice={choice} pk={pk} />
      ))(duplicates)}
    </div>
  )
}

const mapStateToProps = (state, { pk }) => getUpload(pk, state)
export default connect(mapStateToProps)(UploadItem)

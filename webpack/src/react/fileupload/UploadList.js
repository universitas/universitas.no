import { connect } from 'react-redux'
import { Link } from 'components/Icons'
import {
  getUploadPKs,
  uploadAdd,
  toggleUpdateAll,
  getUpdateAll,
} from 'ducks/fileupload'
import UploadItem from './UploadItem'
import { FileInputArea, FileInputButton } from 'containers/FileInput'
import { Filter } from 'components/Filter'

const UploadList = ({
  updateAll,
  toggleUpdateAll,
  fileAdded,
  fileError = console.error,
  files,
}) => (
  <section className="ListPanel">
    <TopBar>
      <FileInputButton
        accept={['image/jpeg', 'image/png']}
        fileAdded={fileAdded}
        fileError={fileError}
        label="last opp filer"
      />
      <Filter
        title={'Rediger alle filer samtidig'}
        label={<Link />}
        isActive={updateAll}
        disabled={files.length < 2}
        onClick={toggleUpdateAll}
      />
    </TopBar>
    <FileInputArea
      accept={['image/jpeg', 'image/png']}
      fileAdded={fileAdded}
      fileError={fileError}
      className="itemList"
    >
      {files.map(pk => <UploadItem pk={pk} key={pk} />)}
    </FileInputArea>
  </section>
)

const TopBar = ({ children }) => (
  <div className="TopBar">
    <div className="Filters">{children}</div>
  </div>
)

const BottomBar = ({}) => (
  <div className="BottomBar">
    <div className="Navigation">
      <div className="info">bottom bar</div>
    </div>
  </div>
)

const mapStateToProps = state => ({
  files: getUploadPKs(state),
  updateAll: getUpdateAll(state),
})
const mapDispatchToProps = { fileAdded: uploadAdd, toggleUpdateAll }
export default connect(mapStateToProps, mapDispatchToProps)(UploadList)

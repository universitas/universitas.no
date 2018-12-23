import { connect } from 'react-redux'
import { Link } from 'components/Icons'
import Panel from 'components/Panel'
import {
  getUploadPKs,
  uploadAdd,
  toggleUpdateAll,
  getUpdateAll,
} from 'ducks/fileupload'
import UploadItem from './UploadItem'
import { FileInputArea, FileInputButton } from 'components/FileInput'
import { Filter } from 'components/ListPanel/Filter'

const UploadList = ({
  updateAll,
  toggleUpdateAll,
  fileAdded,
  fileError = console.error,
  files,
}) => (
  <Panel
    header={
      <div className="Filters">
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
      </div>
    }
  >
    <FileInputArea
      accept={['image/jpeg', 'image/png']}
      fileAdded={fileAdded}
      fileError={fileError}
      className="itemList"
    >
      {files.map(pk => (
        <UploadItem pk={pk} key={pk} />
      ))}
    </FileInputArea>
  </Panel>
)

const TopBar = ({ children }) => (
  <div className="TopBar">
    <div className="Filters">{children}</div>
  </div>
)

const BottomBar = ({}) => (
  <div className="BottomBar">
    <div className="Pagination">
      <div className="info">bottom bar</div>
    </div>
  </div>
)

const mapStateToProps = state => ({
  files: getUploadPKs(state),
  updateAll: getUpdateAll(state),
})
const mapDispatchToProps = { fileAdded: uploadAdd, toggleUpdateAll }
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UploadList)

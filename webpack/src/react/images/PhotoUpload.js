import { connect } from 'react-redux'
import { getUploadPKs, uploadAdd } from 'ducks/fileupload'
import UploadItem from './UploadItem'
import FileInput from 'containers/FileInput'

const UploadPanel = ({ fileAdded, fileError = console.error, files }) => (
  <section className="ListPanel">
    <div className="TopBar">
      <div className="Filters">
        <FileInput
          accept={['image/jpeg', 'image/png']}
          fileAdded={fileAdded}
          fileError={fileError}
          label="last opp filer"
        />
      </div>
    </div>
    <FileInput
      accept={['image/jpeg', 'image/png']}
      fileAdded={fileAdded}
      fileError={fileError}
      className="itemList"
    >
      {files.map(pk => <UploadItem pk={pk} key={pk} />)}
    </FileInput>
  </section>
)

const BottomBar = ({}) => (
  <div className="BottomBar">
    <div className="Navigation">
      <div className="info">bottom bar</div>
    </div>
  </div>
)

const mapStateToProps = (state, ownProps) => ({ files: getUploadPKs(state) })
const mapDispatchToProps = { fileAdded: uploadAdd }
export default connect(mapStateToProps, mapDispatchToProps)(UploadPanel)

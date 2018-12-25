import UploadList from './UploadList.js'
import Duplicate from './Duplicate.js'
import UploadActions from './UploadActions.js'
import UploadForm from './UploadForm.js'
import UploadItem from './UploadItem.js'

// `export Foo from './Foo.js` causes unexpected language server lint error
export { Duplicate, UploadActions, UploadForm, UploadItem }
export default UploadList

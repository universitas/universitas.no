import Detail from './PhotoDetail.js'
import List from './PhotoList.js'
import Tools from './PhotoTools.js'

const PhotoRoute = ({ pk, action }) => (
  <>
    <List pk={pk} action={action} />
    <Detail pk={pk} action={action} />
    <Tools pk={pk} action={action} />
  </>
)
export default PhotoRoute

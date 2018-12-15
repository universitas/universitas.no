import Detail from './PhotoDetail.js'
import List from './PhotoList.js'
import Tools from './PhotoTools.js'

const PhotoRoute = props => (
  <>
    <List {...props} />
    <Detail {...props} />
    <Tools {...props} />
  </>
)
export default PhotoRoute

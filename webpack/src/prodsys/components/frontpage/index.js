import Detail from './FrontpageDetail.js'
import List from './FrontpageList.js'
import Tools from './FrontpageTools.js'

const FrontpageRoute = props => (
  <>
    <List {...props} />
    <Detail {...props} />
    <Tools {...props} />
  </>
)
export default FrontpageRoute

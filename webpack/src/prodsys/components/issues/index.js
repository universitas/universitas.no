import Detail from './IssueDetail.js'
import List from './IssueList.js'
import Tools from './IssueTools.js'
import Create from './IssueCreate.js'

const IssueRoute = props => (
  <>
    <List {...props} />
    <Detail {...props} />
    <Create {...props} />
    <Tools {...props} />
  </>
)
export default IssueRoute

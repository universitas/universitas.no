import Detail from './IssueDetail.js'
import List from './IssueList.js'
import Tools from './IssueTools.js'

const IssueRoute = props => (
  <>
    <List {...props} />
    <Detail {...props} />
    <Tools {...props} />
  </>
)
export default IssueRoute

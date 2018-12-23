import Detail from './ContributorDetail.js'
import Create from './ContributorCreate.js'
import List from './ContributorList.js'
import Tools from './ContributorTools.js'

const ContributorRoute = props => (
  <>
    <List {...props} />
    <Detail {...props} />
    <Create {...props} />
    <Tools {...props} />
  </>
)
export default ContributorRoute

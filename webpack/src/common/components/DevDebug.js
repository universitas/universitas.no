import Debug from './Debug.js'
import { connect } from 'react-redux'
import { getUser } from 'ducks/auth'

// Show only debug info to logged in users
const DevDebug = ({ loggedInUser, ...props }) =>
  loggedInUser ? (
    <Debug {...props} />
  ) : props.children ? (
    <React.Fragment>{props.children}</React.Fragment>
  ) : null

export default connect(state => ({ loggedInUser: getUser(state).username }))(
  DevDebug,
)

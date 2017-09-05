import { connect } from 'react-redux'
import { logOut, logIn, getUser } from 'auth/duck'

const UserTool = ({ username, logOut }) => (
  <div className="User">
    <span className="username">{username}</span>
    <button className="button" onClick={logOut}>Logg ut</button>
  </div>
)

UserTool.propTypes = {
  username: PropTypes.string,
  pending: PropTypes.bool.isRequired,
  logOut: PropTypes.func.isRequired,
}
export default connect(getUser, { logOut })(UserTool)

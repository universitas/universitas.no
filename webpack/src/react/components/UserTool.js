import { connect } from 'react-redux'
import { logOut, logIn, getUser } from 'ducks/auth'

const UserTool = ({ first_name, last_name, username, logOut }) => (
  <div className="UserTool">
    <span className="username">
      {first_name ? `${first_name} ${last_name}` : username}
    </span>
    <button className="button" onClick={logOut}>
      Logg ut
    </button>
  </div>
)

UserTool.propTypes = {
  username: PropTypes.string,
  pending: PropTypes.bool.isRequired,
  logOut: PropTypes.func.isRequired,
}
export default connect(getUser, { logOut })(UserTool)

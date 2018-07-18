import { connect } from 'react-redux'
import { Edit } from 'components/Icons'
import Debug from 'components/Debug'
// import { getSite } from 'ducks/site'
import { getUser } from 'ducks/auth'
import { getLocation } from 'ducks/router'
import { getUx, toggleUx } from 'ducks/site'

const FrontpageEdit = ({ editing, location, user, toggleUx }) =>
  user && module.hot ? (
    <div
      className="FrontpageEdit"
      onClick={() => toggleUx({ editing: !editing })}
    >
      {editing ? <Debug {...location} /> : <Edit />}
    </div>
  ) : null

const mapStateToProps = (state, ownProps) => ({
  user: getUser(state),
  location: getLocation(state),
  editing: getUx(state).editing,
})

export { FrontpageEdit }
const mapDispatchToProps = { toggleUx }
export default connect(mapStateToProps, mapDispatchToProps)(FrontpageEdit)

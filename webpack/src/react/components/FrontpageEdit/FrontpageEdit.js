import { connect } from 'react-redux'
import { Edit } from 'components/Icons'
import Debug from 'components/Debug'
// import { getSite } from 'ducks/site'
import { getUser } from 'ducks/auth'
import { getLocation } from 'ducks/router'

class FrontpageEdit extends React.Component {
  constructor(props) {
    super(props)
    this.state = { open: false }
    this.toggleOpen = () => this.setState({ open: !this.state.open })
  }

  render() {
    const { user } = this.props
    const { open } = this.state
    if (!user) return null
    return (
      <div className="FrontpageEdit" onClick={this.toggleOpen}>
        {open ? <Debug {...this.props.location} /> : <Edit />}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  user: getUser(state),
  location: getLocation(state),
})

export { FrontpageEdit }
const mapDispatchToProps = (dispatch, ownProps) => ({})
export default connect(mapStateToProps, mapDispatchToProps)(FrontpageEdit)

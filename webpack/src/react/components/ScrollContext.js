// https://github.com/faceyspacey/redux-first-router-restore-scroll#caveats

import { connect } from 'react-redux'
import { updateScroll } from 'redux-first-router'

class ScrollContext extends React.Component {
  componentDidUpdate(prevProps) {
    if (prevProps.path !== this.props.path) setTimeout(updateScroll, 200)
  }

  render() {
    return this.props.children
  }
}
const mapStateToProps = ({ location }) => ({ path: location.pathname })
export default connect(mapStateToProps)(ScrollContext)

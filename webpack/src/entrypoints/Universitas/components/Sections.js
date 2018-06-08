import { connect } from 'react-redux'
import { getSite, siteRequested } from 'ducks/site'
import { requestData } from 'utils/hoc'
import { withRouter, NavLink } from 'react-router-dom'
import cx from 'classnames'

const SectionItem = ({ title }) => (
  <NavLink className={cx('MenuItem')} to={`/seksjon/${title}/`}>
    {title}
  </NavLink>
)

const Sections = ({ sections = [] }) => (
  <nav className="Sections">
    {sections
      .slice(0, 5)
      .map(props => <SectionItem key={props.id} {...props} />)}
  </nav>
)
export default withRouter(
  connect(getSite, { fetchData: siteRequested })(
    requestData(Sections, 'sections'),
  ),
)

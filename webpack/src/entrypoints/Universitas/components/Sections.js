import { connect } from 'react-redux'
import { getSite, siteRequested } from 'ducks/site'
import { requestData } from 'utils/hoc'
import cx from 'classnames'

const SectionItem = ({ id, title, url, storytypes = [] }) => (
  <div className={cx('SectionItem')}>{title}</div>
)

const Sections = ({ sections = [] }) => (
  <nav className="Sections">
    {sections.map(props => <SectionItem key={props.id} {...props} />)}
  </nav>
)
const mapStateToProps = getSite
const mapDispatchToProps = { fetchData: siteRequested }
export default connect(mapStateToProps, mapDispatchToProps)(
  requestData(Sections, 'sections')
)

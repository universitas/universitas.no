import { connect } from 'react-redux'
import cx from 'classnames'
import 'styles/universitas.scss'
import { getSite, siteRequested } from 'ducks/site'
import { requestData } from 'utils/hoc'
import Logo from 'components/Universitas'
import './Menu.scss'

const SectionItem = ({ id, title, url, storytypes = [] }) => (
  <div className={cx('SectionItem')}>{title}</div>
)

export const Menu = ({ sections = [], ...props }) => (
  <section className={cx('Menu')}>
    <Logo />
    {sections.map(props => <SectionItem key={props.id} {...props} />)}
  </section>
)

const mapStateToProps = getSite
const mapDispatchToProps = { fetchData: siteRequested }
export default connect(mapStateToProps, mapDispatchToProps)(
  requestData(Menu, 'sections')
)

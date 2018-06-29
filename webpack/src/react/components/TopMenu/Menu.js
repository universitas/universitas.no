import cx from 'classnames'
import Link, { NavLink } from 'redux-first-router-link'
import { Universitas } from 'components/Logos'
import Sections from './Sections.js'
import ErrorBoundary from 'react-error-boundary'
import { toHome, toPdf, toPubSchedule, toAbout, toAdInfo } from 'ducks/router'
import LanguageWidget from './LanguageWidget.js'
import SearchWidget from './SearchWidget.js'
import { Menu, Close } from 'components/Icons'

const Level = ({ children, className }) => (
  <div className={cx('Level', className)}>{children}</div>
)

const Group = ({ children, ...props }) => (
  <div className={cx('Group', props)}>{children}</div>
)

const MenuIcon = ({ expanded = false, onClick }) => (
  <div className="MenuIcon">
    {expanded ? <Close onClick={onClick} /> : <Menu onClick={onClick} />}
  </div>
)

const PageLinks = ({ year }) => (
  <Group pageLinks>
    <NavLink className={cx('MenuItem')} to={toPdf(year)}>
      pdf
    </NavLink>
    <NavLink className={cx('MenuItem')} to={toPubSchedule(year)}>
      utgivelsesplan
    </NavLink>
    <NavLink className={cx('MenuItem')} to={toAbout()}>
      om universitas
    </NavLink>
    <NavLink className={cx('MenuItem')} to={toAdInfo()}>
      annonsér
    </NavLink>
  </Group>
)

const year = new Date().getFullYear()

class TopMenu extends React.Component {
  constructor(props) {
    super(props)
    this.state = { expanded: false }
    this.toggleExpand = () => this.setState({ expanded: !this.state.expanded })
  }

  render() {
    const { expanded } = this.state
    return (
      <section className={cx('TopMenu')}>
        <Level>
          <Link to={toHome()}>
            <Universitas className={cx('Logo')} />
          </Link>
          <Sections />
          <PageLinks {...this.props} />
          <LanguageWidget />
          <SearchWidget />
          <MenuIcon expanded={expanded} onClick={this.toggleExpand} />
        </Level>
      </section>
    )
  }
}

export default TopMenu

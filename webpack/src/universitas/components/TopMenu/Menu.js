import cx from 'classnames'
import Link, { NavLink } from 'redux-first-router-link'
import { Universitas } from 'components/Logos'
import Sections from './Sections.js'
import ErrorBoundary from 'react-error-boundary'
import { toHome, toPdf, toPubSchedule, toAbout, toAdInfo } from 'ducks/router'
import LanguageWidget from './LanguageWidget.js'
import SearchWidget from './SearchWidget.js'
import { Menu, Close } from 'components/Icons'
import { connect } from 'react-redux'
import { getUx, toggleUx } from 'ducks/site'

const Level = ({ children, ...props }) => (
  <div className={cx('Level', props)}>
    <div className="inner">{children}</div>
  </div>
)

const Group = ({ children, ...props }) => (
  <div className={cx('Group', props)}>{children}</div>
)

const MenuIcon = ({ expanded = false, onClick }) => (
  <div onClick={onClick} className={cx('MenuIcon', { expanded })}>
    {expanded ? <Close /> : <Menu />}
  </div>
)

const PageLinks = ({ year }) => (
  <Group pageLinks>
    <NavLink className={cx('MenuItem')} to={toPdf(year)}>
      PDF
    </NavLink>
    <NavLink className={cx('MenuItem')} to={toPubSchedule(year)}>
      Utgivelsesplan
    </NavLink>
    <NavLink className={cx('MenuItem')} to={toAbout()}>
      Om Universitas
    </NavLink>
    <NavLink className={cx('MenuItem')} to={toAdInfo()}>
      Annonsér
    </NavLink>
  </Group>
)

const year = new Date().getFullYear()

const TopMenu = ({ expanded, toggleUx }) => (
  <section className={cx('TopMenu')}>
    <Level one>
      <Link className={cx('logoLink')} to={toHome()}>
        <Universitas className={cx('Logo')} />
      </Link>
      <Sections />
      <PageLinks />
      <LanguageWidget />
      <SearchWidget />
      <MenuIcon
        expanded={expanded}
        onClick={() => toggleUx({ menuExpanded: !expanded })}
      />
    </Level>
    {expanded && (
      <Level two>
        <SearchWidget autoFocus />
        <LanguageWidget />
        <Sections />
        <PageLinks />
      </Level>
    )}
  </section>
)

const mapStateToProps = state => ({ expanded: getUx(state).menuExpanded })
const mapDispatchToProps = { toggleUx }

export default connect(mapStateToProps, mapDispatchToProps)(TopMenu)

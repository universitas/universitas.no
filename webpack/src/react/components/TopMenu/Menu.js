import cx from 'classnames'
import Link, { NavLink } from 'redux-first-router-link'
import { Universitas } from 'components/Logos'
import Sections from './Sections.js'
import ErrorBoundary from 'react-error-boundary'
import { toHome, toPdf, toPubSchedule, toAbout, toAdInfo } from 'ducks/router'
import LanguageWidget from './LanguageWidget.js'
import SearchWidget from './SearchWidget.js'

const Level = ({ children, className }) => (
  <div className={cx('Level', className)}>{children}</div>
)

const Group = ({ children }) => <div className="Group">{children}</div>

const PageLinks = ({ year }) => (
  <Group>
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

const Menu = ({ sections = [], ...props }) => (
  <section className={cx('Menu')}>
    <Level>
      <Link to={toHome()}>
        <Universitas className={cx('Logo')} />
      </Link>
      <Sections />
      <PageLinks {...props} />
      <LanguageWidget />
      <SearchWidget />
    </Level>
  </section>
)

export default Menu

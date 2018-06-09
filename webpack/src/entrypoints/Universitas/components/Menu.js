import cx from 'classnames'
import Link, { NavLink } from 'redux-first-router-link'
import 'styles/universitas.scss'
import Logo from 'components/Universitas'
import Sections from './Sections.js'
import LanguageWidget from './LanguageWidget.js'
import SearchWidget from './SearchWidget.js'
import ErrorBoundary from 'react-error-boundary'
import './Menu.scss'
import { toHome, toPdf } from 'ducks/router'

const Level = ({ children, className }) => (
  <div className={cx('Level', className)}>{children}</div>
)

const Spacer = () => <div style={{ flex: '1' }} />

const Menu = ({ sections = [], ...props }) => (
  <section className={cx('Menu')}>
    <Level>
      <Link to={toHome()}>
        <Logo className={cx('Logo')} />
      </Link>
      <Sections />
      <NavLink className={cx('MenuItem')} to={toPdf()}>
        pdf
      </NavLink>
      <Spacer />
      <LanguageWidget />

      <SearchWidget />
    </Level>
  </section>
)

export default Menu

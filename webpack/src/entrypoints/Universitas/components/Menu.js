import cx from 'classnames'
import 'styles/universitas.scss'
import Logo from 'components/Universitas'
import Sections from './Sections.js'
import LanguageWidget from './LanguageWidget.js'
import SearchWidget from './SearchWidget.js'
import ErrorBoundary from 'react-error-boundary'
import './Menu.scss'
import { NavLink } from 'react-router-dom'

const Level = ({ children, className }) => (
  <div className={cx('Level', className)}>{children}</div>
)

const Spacer = () => <div style={{ flex: '1' }} />

const Menu = ({ sections = [], ...props }) => (
  <section className={cx('Menu')}>
    <Level>
      <NavLink to="/">
        <Logo className={cx('Logo')} />
      </NavLink>
      <Sections />
      <NavLink className={cx('MenuItem')} to="/pdf/">
        pdf
      </NavLink>
      <Spacer />
      <LanguageWidget />

      <SearchWidget />
    </Level>
  </section>
)

export default Menu

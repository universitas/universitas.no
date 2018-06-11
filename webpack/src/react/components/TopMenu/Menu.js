import cx from 'classnames'
import Link, { NavLink } from 'redux-first-router-link'
import Logo from 'components/Universitas'
import Sections from './Sections.js'
import ErrorBoundary from 'react-error-boundary'
import { toHome, toPdf } from 'ducks/router'
import LanguageWidget from './LanguageWidget.js'
import SearchWidget from './SearchWidget.js'

const Level = ({ children, className }) => (
  <div className={cx('Level', className)}>{children}</div>
)

const Group = ({ children }) => <div className="Group">{children}</div>

const Menu = ({ sections = [], ...props }) => (
  <section className={cx('Menu')}>
    <Level>
      <Group>
        <Link to={toHome()}>
          <Logo className={cx('Logo')} />
        </Link>
        <Sections />
      </Group>
      <Group>
        <NavLink className={cx('MenuItem')} to={toPdf()}>
          pdf
        </NavLink>
      </Group>
      <Group>
        <LanguageWidget />
        <SearchWidget />
      </Group>
    </Level>
  </section>
)

export default Menu

import cx from 'classnames'
import 'styles/universitas.scss'
import Logo from 'components/Universitas'
import Sections from './Sections.js'
import LanguageWidget from './LanguageWidget.js'
import SearchWidget from './SearchWidget.js'
import ErrorBoundary from 'react-error-boundary'
import './Menu.scss'

const Level = ({ children, className }) => (
  <div className={cx('Level', className)}>{children}</div>
)

const Spacer = () => <div style={{ flex: '1' }} />

const Menu = ({ sections = [], ...props }) => (
  <section className={cx('Menu')}>
    <Level>
      <Logo className={cx('Logo')} />
      <Sections />
      <Spacer />
      <LanguageWidget />
      <SearchWidget />
    </Level>
  </section>
)

export default Menu

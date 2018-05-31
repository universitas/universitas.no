import cx from 'classnames'
import 'styles/universitas.scss'
import Logo from 'components/Universitas'
import Sections from './Sections.js'
import './Menu.scss'

const Level = ({ children, className }) => (
  <div className={cx('Level', className)}>{children}</div>
)

const Search = ({}) => (
  <div className="Search">
    <input type="text" placeholder="søk..." />
  </div>
)

const Menu = ({ sections = [], ...props }) => (
  <section className={cx('Menu')}>
    <Level>
      <Logo className={cx('Logo')} />
      <Sections />
      <Search />
    </Level>
  </section>
)

export default Menu

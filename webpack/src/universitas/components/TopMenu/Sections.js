import { NavLink } from 'redux-first-router-link'
import { toSection } from 'ducks/router'
import cx from 'classnames'

const capitalize = R.replace(/./, R.toUpper)

const Sections = ({ sections = ['nyhet', 'kultur', 'magasin', 'debatt'] }) => (
  <nav className="Sections">
    {sections.map(title => (
      <NavLink
        key={title}
        className={cx('MenuItem')}
        to={toSection(title)}
        children={capitalize(title)}
      />
    ))}
  </nav>
)
export default Sections

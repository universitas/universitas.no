import { connect } from 'react-redux'
import { getSite, siteRequested } from 'ducks/site'
import { getMenu, onlySection, toggleSection } from 'ducks/menu'
import { requestData } from 'utils/hoc'
import cx from 'classnames'

let SectionItem = ({ id, title, storytypes = [], active, onClick }) => (
  <div className={cx('SectionItem', title, { active })} onClick={onClick}>
    {title}
  </div>
)

const mergeProps = (
  { section },
  { onlySection, toggleSection },
  { id, ...props }
) => {
  const active = section[id]
  const onClick = active ? () => toggleSection(`${id}`) : () => onlySection(id)
  return { active, onClick, ...props }
}
SectionItem = connect(getMenu, { onlySection, toggleSection }, mergeProps)(
  SectionItem
)

const Sections = ({ sections = [] }) => (
  <nav className="Sections">
    {sections
      .slice(0, 5)
      .map(props => <SectionItem key={props.id} {...props} />)}
  </nav>
)
export default connect(getSite, { fetchData: siteRequested })(
  requestData(Sections, 'sections')
)

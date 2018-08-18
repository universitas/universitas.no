import { Tool } from 'components/tool'
import cx from 'classnames'
import 'styles/tool.scss'

const renderTool = (key, { onClick, active, icon, toolTip }) => (
  <Tool
    key={key}
    onClick={onClick || (e => console.log(`${key} clicked`))}
    active={active || true}
    icon={icon || 'Fallback'}
    toolTip={toolTip || key}
  />
)
const ToolBar = ({ className, row = true, tools, ...props }) => (
  <section
    className={cx('ToolBar', className, row ? 'flexrow' : 'flexcolumn')}
    {...props}
  >
    {Object.keys(tools).map(key => renderTool(key, tools[key]))}
  </section>
)
ToolBar.propTypes = {
  className: PropTypes.string,
  row: PropTypes.bool,
  tools: PropTypes.objectOf(
    PropTypes.shape({
      icon: PropTypes.string,
      active: PropTypes.bool,
      onClick: PropTypes.func,
      toolTip: PropTypes.string,
    }),
  ),
}
export default ToolBar

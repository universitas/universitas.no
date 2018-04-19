import * as Icons from './Icons'
import 'styles/tool.scss'
import cx from 'classnames'

const Tool = ({
  onClick,
  icon,
  disabled,
  active,
  toolTip,
  label,
  className,
  ...props
}) => {
  const Icon = Icons[icon] || Icons.Fallback
  return (
    <div
      className={cx(
        'Tool',
        { disabled, active, clickable: onClick },
        className
      )}
      title={toolTip}
      onMouseDown={e => e.preventDefault()}
      onClick={onClick}
    >
      <Icon {...props} />
      {label && <small className="toolLabel">{label}</small>}
    </div>
  )
}

export default Tool

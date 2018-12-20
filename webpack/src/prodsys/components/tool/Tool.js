import * as Icons from 'components/Icons'
import cx from 'classnames'
import './Tool.scss'

const Tool = ({
  onClick,
  icon,
  disabled = !onClick,
  active,
  title,
  label,
  className,
  style,
  order,
  ...props
}) => {
  const Icon = Icons[icon] || Icons.Fallback
  return (
    <div
      className={cx(
        'Tool',
        { disabled, active, clickable: onClick },
        className,
      )}
      title={title}
      onMouseDown={e => e.preventDefault()}
      onClick={disabled ? null : onClick}
      style={{ order, ...style }}
    >
      <Icon {...props} />
      {label && <small className="toolLabel">{label}</small>}
    </div>
  )
}

export default Tool

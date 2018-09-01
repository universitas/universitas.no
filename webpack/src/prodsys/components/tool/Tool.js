import * as Icons from 'components/Icons'
import cx from 'classnames'

const Tool = ({
  onClick,
  icon,
  disabled,
  active,
  title,
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
        className,
      )}
      title={title}
      onMouseDown={e => e.preventDefault()}
      onClick={onClick}
    >
      <Icon {...props} />
      {label && <small className="toolLabel">{label}</small>}
    </div>
  )
}

export default Tool

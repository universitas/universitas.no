import PropTypes from 'prop-types'
import React from 'react'
import * as Icons from './Icons'
import 'styles/tool.scss'

const Tool = ({ onClick, icon, active, toolTip, ...props }) => {
  const Icon = Icons[icon] || Icons.Fallback
  const className = `Tool ${active ? 'active' : 'inactive'}`
  return (
    <div
      className={className}
      title={toolTip}
      onMouseDown={e => e.preventDefault()}
      onClick={onClick}
    >
      <Icon {...props} />
    </div>
  )
}
Tool.propTypes = {
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  toolTip: PropTypes.string.isRequired,
}

export default Tool

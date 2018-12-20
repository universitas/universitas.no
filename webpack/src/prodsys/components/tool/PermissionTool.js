import Tool from './Tool.js'
import { connect } from 'react-redux'
import { getPermission } from 'common/ducks/auth.js'

const mapStateToProps = (state, { title, permission = '' }) =>
  R.ifElse(
    getPermission(permission),
    R.always({}),
    R.always({ disabled: true, title: 'ikke tilgjengelig' }),
  )(state)

const PermissionTool = connect(mapStateToProps)(
  ({ permission, dispatch, ...props }) => <Tool {...props} />,
)
export default PermissionTool

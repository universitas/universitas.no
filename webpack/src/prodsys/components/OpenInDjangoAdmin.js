import { PermissionTool } from 'components/tool'
const OpenInDjangoAdmin = ({ path, pk, ...props }) => {
  const url = `/admin/${path}/${pk ? `${pk}/change/` : ''}`
  return (
    <PermissionTool
      permission="staff user"
      icon="Tune"
      title="rediger i django-admin"
      label="admin"
      onClick={() => window.open(url)}
      order={100}
      {...props}
    />
  )
}
export default OpenInDjangoAdmin

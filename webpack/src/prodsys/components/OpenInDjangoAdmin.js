import { Tool } from 'components/tool'
const OpenInDjangoAdmin = ({ path, pk, ...props }) => {
  const url = `/admin/${path}/${pk ? `${pk}/change/` : ''}`
  return (
    <Tool
      icon="Tune"
      title="rediger i django-admin"
      label="admin"
      onClick={() => window.open(url)}
      {...props}
    />
  )
}
export default OpenInDjangoAdmin

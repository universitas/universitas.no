const spacer = <div className="spacer" style={{ flex: 1, order: 1 }} />
const ModelTools = ({ children, ...props }) => (
  <nav className="ModelTools ToolBar column medium" {...props}>
    {children}
    {spacer}
  </nav>
)
export default ModelTools

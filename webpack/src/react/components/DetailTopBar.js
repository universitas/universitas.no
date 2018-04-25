const DetailTopBar = ({ pk, title, children }) => (
  <div className="DetailTopBar">
    <div className="pk">{pk}</div>
    <div className="title">{title}</div>
    {children}
  </div>
)
export default DetailTopBar

import { Info as Icon } from 'components/Icons'

const Info = ({ children }) => (
  <div className="Info">
    <div className="icon">
      <Icon />
    </div>
    <div className="message">{children}</div>
  </div>
)

export default Info

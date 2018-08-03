import { capitalize } from 'utils/text'

const ContactCard = ({ id, position, display_name, phone, email, thumb }) => (
  <div className="ContactCard">
    {thumb && <img className="thumb" src={thumb} alt={display_name} />}
    <div className="position">{capitalize(position)}</div>
    <div className="name">{display_name}</div>
    <div className="phone">{phone}</div>
    <div className="email">{email}</div>
  </div>
)

export default ContactCard

const ContactCard = ({ id, position, display_name, phone, email, thumb }) => (
  <div className="ContactCard" key={id}>
    <img className="thumb" src={thumb} alt={display_name} />
    <div className="position">{position}</div>
    <div className="name">{display_name}</div>
    <div className="phone">{phone}</div>
    <div className="email">{email}</div>
  </div>
)

export default ContactCard

import { capitalize, phoneFormat } from 'utils/text'
import { phoneTo, mailTo } from 'utils/phonemail'
import anonymous from 'images/anonymous.jpg'
import cx from 'classnames'
import './ContactCard.scss'

const Field = ({ name, label, value }) => (
  <div className={cx('Field', name)}>
    {label && <label className="label">{label}:</label>}
    <div className="value">{value}</div>
  </div>
)

export const ContactCard = ({
  id,
  position,
  display_name: name,
  phone,
  email,
  thumb = anonymous,
}) => (
  <div className="ContactCard">
    <img className="thumb" src={thumb} alt={name} />
    <Field
      name="position"
      label="stilling"
      value={capitalize(position.title)}
    />
    <Field name="name" label="" value={name} />
    <Field name="email" label="epost" value={mailTo(email)} />
    <Field name="phone" label="telefon" value={phoneTo(phone)} />
  </div>
)

export const ContactGrid = ({ contacts = [] }) => (
  <div className="ContactGrid">
    {contacts.map(props => (
      <ContactCard key={props.id} {...props} />
    ))}
  </div>
)

import { capitalize, phoneFormat } from 'utils/text'
import avatar from './avatar.jpg'
import cx from 'classnames'

const Field = ({ name, label, value }) => (
  <div className={cx('Field', name)}>
    {label && <label className="label">{label}:</label>}
    <div className="value">{value || '–'}</div>
  </div>
)

const mailTo = R.ifElse(R.not, R.always('–'), mail => (
  <a href={`mailto:${mail}`}>{R.replace(/@/, '\u200B@', mail)}</a>
))

export const ContactCard = ({
  id,
  position,
  display_name: name,
  phone,
  email,
  thumb = avatar,
}) => (
  <div className="ContactCard">
    <img className="thumb" src={thumb} alt={name} />
    <Field name="position" label="stilling" value={capitalize(position)} />
    <Field name="name" label="" value={name} />
    <Field name="email" label="epost" value={mailTo(email)} />
    <Field name="phone" label="telefon" value={phoneFormat(phone)} />
  </div>
)

export const ContactGrid = ({ contacts = [] }) => (
  <div className="ContactGrid">
    {contacts.map(props => <ContactCard key={props.id} {...props} />)}
  </div>
)

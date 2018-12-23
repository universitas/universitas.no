// Email Field
import { stringify } from 'utils/text'

export const EditableField = ({ value, ...args }) => (
  <input
    type="email"
    value={stringify(value)}
    {...args}
    title={JSON.stringify(args, null, 2)}
  />
)
export const DetailField = ({ value, ...args }) => (
  <span {...args}>{mailTo(value)}</span>
)

const phoneLink = R.pipe(
  R.defaultTo(''),
  R.replace(/\s/g, ''),
  R.when(
    R.pipe(
      R.length,
      R.equals(8),
    ),
    R.concat('+47'),
  ),
  R.concat('sms://'),
)

const phoneTo = R.ifElse(R.not, R.always('–'), phone => (
  <a href={phoneLink(phone)}>{phoneFormat(phone)}</a>
))

const mailTo = R.ifElse(R.not, R.always('–'), mail => (
  <a href={`mailto:${mail}`}>{R.replace(/@/, '\u200B@', mail)}</a>
))

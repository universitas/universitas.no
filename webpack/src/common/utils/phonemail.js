import { phoneFormat } from 'utils/text'

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

export const phoneTo = R.ifElse(R.not, R.always('–'), phone => (
  <a href={phoneLink(phone)}>{phoneFormat(phone)}</a>
))

export const mailTo = R.ifElse(R.not, R.always('–'), mail => (
  <a href={`mailto:${mail}`}>{R.replace(/@/, '\u200B@', mail)}</a>
))

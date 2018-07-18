import { parseText } from './index.js'
import { cleanText } from 'utils/text'

export const inlineText = R.pipe(
  cleanText,
  text => parseText(text, false),
  R.map(
    R.cond([
      [R.is(String), R.identity],
      [R.propEq('type', 'em'), ({ children }) => <em>{children}</em>],
      [R.T, R.prop('children')],
    ]),
  ),
)

import { parseText } from './index.js'
import { cleanText } from 'utils/text'

export const inlineText = R.when(
  R.identity,
  R.pipe(
    cleanText,
    R.trim,
    text => parseText(text, false),
    R.map(
      R.cond([
        [R.is(String), R.identity],
        [R.propEq('type', 'em'), ({ children }) => <em>{children}</em>],
        [R.propEq('type', 'newline'), () => <br />],
        [R.T, R.prop('children')],
      ]),
    ),
  ),
)

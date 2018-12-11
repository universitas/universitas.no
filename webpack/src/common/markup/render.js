import { parseText } from './index.js'
import { cleanText, specialCharacters } from 'utils/text'

export const inlineText = R.when(
  R.identity,
  R.pipe(
    cleanText,
    specialCharacters,
    R.trim,
    text => parseText(text, false),
    R.addIndex(R.map)(
      R.cond([
        [R.is(String), R.identity],
        [
          R.propEq('type', 'em'),
          (node, idx) => <em key={idx}>{node.children}</em>,
        ],
        [R.propEq('type', 'newline'), (node, idx) => <br key={idx} />],
        [R.T, R.prop('children')],
      ]),
    ),
  ),
)

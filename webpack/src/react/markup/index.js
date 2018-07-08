import rules from './rules'
import { hashText } from 'utils/text'

export const makeParser = ({
  type,
  pattern,
  groups = ['content'],
  inline,
  process = R.identity,
}) => text => {
  const regex = new RegExp(pattern, inline ? 'uy' : 'muy')
  const result = regex.exec(text)
  if (!result) return null
  const [content, ...rest] = result
  const groupmatches = R.zipObj(groups, rest)
  return process({
    match: result,
    content,
    index: regex.lastIndex,
    type,
    ...groupmatches,
  })
}

const [inlineRules, blockRules] = R.pipe(
  R.map(tag => ({ parse: makeParser(tag), ...tag })),
  R.values,
  R.sortBy(R.prop('order')),
  R.partition(R.prop('inline')),
)(rules)

// Parse markup text to render tree
export const parseText = (text, multiline = true, lastIndex = 0) => {
  const nodes = []
  const rules = multiline ? blockRules : inlineRules
  const types = R.pipe(R.pluck('type'), R.join(' '))(rules)
  let looplimit = 99999 // hack to avoid infinite loops during development.
  while (looplimit-- && text) {
    for (const rule of rules) {
      const result = rule.parse(text)
      if (result) {
        const { index, content, ...node } = result
        if (rule.type != 'whitespace') {
          if (R.contains(rule.type, ['text', 'character'])) nodes.push(content)
          else {
            const children = rule.leaf
              ? content ? [content] : []
              : parseText(content, R.contains('\n', content))
            // node.index = lastIndex
            // node.hash = hashText(match)
            nodes.push({ ...node, children })
          }
        }
        lastIndex += index
        text = text.slice(index)
        break
      }
    }
  }
  return nodes
}

const cleanMarkup = R.pipe(
  R.replace(/“/g, '«'),
  R.replace(/”/g, '»'),
  R.replace(/--/g, '–'),
  R.replace(/([.!?;:] |^) ?[-–] ?/gm, '$1– '),
  R.replace(/\B"(.*?)"\B/gu, '«$1»'),
  R.trim,
  R.replace(/\n{3,}/g, '\n\n'),
)

// Render parse tree to markup text
const renderText = tree => {
  let res = []
  for (const node of tree) {
    if (R.is(String, node)) {
      res.push(node)
    } else {
      const rule = rules[node.type]
      res.push(rule.reverse({ ...node, content: renderText(node.children) }))
      if (!rule.inline) res.push('\n')
    }
  }
  return cleanMarkup(R.join('', res))
}

export { rules, renderText }

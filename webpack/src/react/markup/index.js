import { tags, blockTags, inlineTags } from './tags'
import { hashText } from 'utils/text'

// Parse markup text to render tree
export const parseText = (text, multiline = true, lastIndex = 0) => {
  const nodes = []
  const rules = multiline ? blockTags : inlineTags
  const types = R.pipe(R.pluck('type'), R.join(' '))(rules)
  let looplimit = 99 // hack to avoid infinite loops during development. Should not be needed when tests are passing.
  while (looplimit-- && text) {
    for (const rule of rules) {
      const result = rule.parse(text)
      if (result) {
        const { index, content, match, ...node } = result
        if (rule.type != 'whitespace') {
          if (rule.type == 'text') nodes.push(content)
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
export const renderText = tree => {
  let res = []
  for (const node of tree) {
    if (R.is(String, node)) {
      res.push(node)
    } else {
      const rule = tags[node.type]
      res.push(rule.reverse({ ...node, content: renderText(node.children) }))
      if (!rule.inline) res.push('\n')
    }
  }
  return cleanMarkup(R.join('', res))
}

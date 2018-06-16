import memoize from 'lodash/memoize'

const makeRule = (type, re) => text => {
  const m = re.exec(text)
  return m && [{ type, children: m[1] }, text.slice(m[0].length)]
}

const link = text => {
  const m = /^\[(.*?)\]\((.*?)\)/.exec(text)
  return (
    m && [
      { type: 'link', children: m[1], target: m[2] },
      text.slice(m[0].length),
    ]
  )
}

const rules = [
  link,
  makeRule('strong', /^\*([^_*]+)\*?/),
  makeRule('em', /^\_([^_*]+)\_?/),
  makeRule('', /^(.[^\[\*_]*)/),
]

const next_node = (rules, text) => {
  for (let r of rules) {
    let result = r(text)
    if (result) {
      return result
    }
  }
  throw 'no matching rules'
}

export const lineParser = memoize(text => {
  const nodes = []
  let node
  while (text) {
    ;[node, text] = next_node(rules, text)
    nodes.push(node)
  }
  return nodes
})

const xTag = line => {
  const m = line.match(/^@(\S*):(.*)$/)
  return m && { type: m[1], line: m[2] }
}

const ul = line => {
  const m = line.match(/^[*#] (.*)$/)
  return m && { type: 'ul', line: m[1] }
}

const ol = line => {
  const m = line.match(/^(#|\d+)[.)] (.*)$/)
  return m && { type: 'ol', value: parseInt(m[1]), line: m[2] }
}
const fallback = line => ({ type: 'txt', line })

const groupLi = sedon => {
  const nodes = sedon.reverse()
  const result = []
  let node, last, type
  while ((node = nodes.pop())) {
    last = result[result.length - 1] || {}
    type = node.type
    if (type == 'ul' || type == 'ol') {
      node.type = 'li'
      if (last.type === type) {
        last.children.push(node)
      } else {
        result.push({ type, index: node.index, children: [node] })
      }
    } else {
      result.push(node)
    }
  }
  return result
}

export const blockParser = memoize(text => {
  const nodes = text
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)
    .map(l => xTag(l) || ul(l) || ol(l) || fallback(l))
    .map(({ line, ...props }, index) => ({
      index,
      children: lineParser(line),
      ...props,
    }))

  return groupLi(nodes)
})

import Block, { FallBack } from './components/Block'
import { toJson } from 'utils/text'
const [leaf, inline] = [true, true]

const baseTags = {
  whitespace: {
    pattern: /\s+/m,
    order: 0,
  },
  character: {
    inline,
    leaf,
    pattern: /./,
    order: 999,
    react: ({ children }) => children,
  },
  text: {
    inline,
    leaf,
    pattern: /[^\n_[]+/,
    order: 0,
    react: ({ children }) => children,
  },
  link: {
    inline,
    pattern: /\[(?<content>.*?)\](\((?<ref>.*)\))?/,
    reverse: ({ ref, content }) =>
      ref != content ? `[${content}](${ref})` : `[${content}]`,
    process: ({ ref, content, ...node }) => ({
      ref: ref || content,
      content,
      ...node,
    }),
    react: ({ ref, children }) => (
      <a href={ref} title="link">
        {children}
      </a>
    ),
  },
  em: {
    inline,
    pattern: /_(?<content>.*?)_/,
    reverse: ({ content }) => `_${content}_`,
    react: ({ children }) => <em>{children}</em>,
  },
  place: {
    leaf,
    pattern: /^ *\[\[ *(?<name>.*?) *\]\] *$/,
    reverse: ({ name }) => `\n[[ ${name} ]]\n`,
  },
  blockTag: {
    pattern: /^@(?<tag>\S*): ?(?<content>.*)$/,
    reverse: ({ tag, content }) => {
      const space = R.contains(tag, ['mt', 'spm', 'tingo']) ? '\n' : ''
      return `${space}@${tag}: ${content}`
    },
    react: Block,
    process: R.evolve({ tag: R.toLower }),
  },
  listItem: {
    pattern: /^[*#] +(?<content>.*)$/,
    order: 99,
    reverse: ({ content }) => `# ${content}`,
    react: ({ children }) => <li>{children}</li>,
  },
  paragraph: {
    pattern: /^.*$/,
    order: 100,
    react: props => <Block {...props} tag="txt" />,
  },
  facts: {
    pattern: /^@fakta:\s?(?<content>(\n?.+)+)$/,
    order: 1,
    reverse: ({ content }) => `\n@fakta: ${content}\n`,
    react: ({ children }) => <aside>{children}</aside>,
  },
  pullquote: {
    pattern: /^@sitat:\s?(?<content>(\n?.+)+)$/,
    order: 1,
    reverse: ({ content }) => `\n@sitat: ${content}\n`,
    react: ({ children }) => <blockquote>«{children}»</blockquote>,
  },
}

const makeParser = (
  { pattern, inline, process = R.identity },
  type,
) => text => {
  const regex = new RegExp(pattern, inline ? 'uy' : 'muy')
  const result = regex.exec(text)
  return (
    result &&
    process({
      match: result[0],
      content: result[0],
      index: regex.lastIndex,
      type,
      ...result.groups,
    })
  )
}

const defaultTag = {
  order: 10,
  leaf: false,
  inline: false,
  react: () => <div>No Component</div>,
  reverse: R.propOr('[NO CONTENT]', 'content'),
}

const tags = R.pipe(
  R.map(R.merge(defaultTag)),
  R.mapObjIndexed((val, key, obj) => ({
    type: key,
    parse: makeParser(val, key),
    ...val,
  })),
)(baseTags)

const [inlineTags, blockTags] = R.pipe(
  R.values,
  R.sortBy(R.prop('order')),
  R.partition(R.prop('inline')),
)(tags)

export { tags, inlineTags, blockTags, makeParser }

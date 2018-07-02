// lexer rules for the universitas markup language

import { makeFuzzer } from 'utils/text'

// These are the markup tags.
// Usage example:
// @txt: [content]
export const TAGS = [
  'txt',
  'tingo',
  'mt',
  'bl',
  'ing',
  'tit',
  'tema',
  'sitatbyline',
  'spm',
  'fakta',
  'faktatit',
  'sitat',
]

const [leaf, inline] = [true, true] // helpers for object shorthand
const baseRules = {
  whitespace: {
    pattern: /\s+/m,
    order: 0,
  },
  escaped: {
    inline,
    order: 0,
    type: 'character',
    pattern: /\\(\W)/,
  },
  character: {
    inline,
    leaf,
    pattern: /./,
    order: 999,
  },
  text: {
    inline,
    leaf,
    pattern: /[^\n\\_[]+/,
    order: 0,
  },
  link: {
    inline,
    pattern: /\[(?<content>.*?)\](\((?<name>.*?)\))?/,
    reverse: ({ name, content }) =>
      name != content ? `[${content}](${name})` : `[${content}]`,
    process: ({ name, ...node }) => ({
      name: name || node.content,
      ...node,
    }),
  },
  em: {
    inline,
    pattern: /_(?<content>.*?)_/,
    reverse: ({ content }) => `_${content}_`,
  },
  place: {
    leaf,
    pattern: /^ *\[\[ *(?<name>.*?) ( *\| *(?<flags>.*?))? *\]\] *$/,
    reverse: ({ name, flags = '' }) =>
      `\n[[ ${name}${flags && ' | '}${flags} ]]\n`,
  },
  blockTag: {
    pattern: /^@(?<tag>[^:]+): ?(?<content>.*)$/,
    reverse: ({ tag, content }) => {
      const space = R.contains(tag, ['mt', 'spm', 'tingo']) ? '\n' : ''
      return `${space}@${tag}: ${content}`
    },
    process: R.evolve({ tag: makeFuzzer(TAGS, 0.5) }), // fuzzy match
  },
  listItem: {
    pattern: /^(\* |# |@li:) *(?<content>.*)$/,
    order: 9,
    reverse: ({ content }) => `# ${content}`,
  },
  paragraph: {
    pattern: /^.*$/,
    order: 100,
  },
  facts: {
    pattern: /^@fakta:\s?(?<content>(\n?.+)+)$/,
    order: 1,
    reverse: ({ content }) => `\n@fakta: ${content}\n`,
  },
  pullquote: {
    pattern: /^@sitat:\s?(?<content>(\n?.+)+)$/,
    order: 1,
    reverse: ({ content }) => `\n@sitat: ${content}\n`,
  },
}

// fallback lexer rule
const defaultRule = {
  order: 10,
  leaf: false,
  inline: false,
  reverse: R.propOr('[NO CONTENT]', 'content'),
}

export default R.pipe(
  R.map(R.merge(defaultRule)),
  R.mapObjIndexed((val, type, obj) => ({ type, ...val })),
)(baseRules)

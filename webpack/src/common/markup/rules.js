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
  'bt',
  'ing',
  'sitatbyline',
  'sitat',
  'tit',
  'stikktit',
  'tema',
  'spm',
  'fakta',
  'faktatit',
]

const [leaf, inline] = [true, true] // helpers for object shorthand
const baseRules = {
  whitespace: {
    // empty block
    pattern: /\s+/m,
    order: 2,
  },
  escaped: {
    // escape special characters with backslash \
    inline,
    order: 0,
    type: 'character',
    pattern: /\\(.)/,
  },
  newline: {
    // newline in "inline" text (for headlines)
    inline,
    leaf,
    pattern: / *\n{2,} */,
    reverse: () => '\n\n',
    order: 1,
  },
  space: {
    // multiple inline space are truncated
    inline,
    leaf,
    pattern: /\s+/,
    order: 2,
    reverse: () => ' ',
  },
  text: {
    // text
    inline,
    leaf,
    pattern: /[^_\*\[\n\\]+/,
    order: 0,
  },
  character: {
    // special characters ( for example incomplete tags )
    inline,
    leaf,
    pattern: /./,
    order: 999,
  },
  link: {
    // renders to html link
    inline,
    pattern: /\[([^\]]*)\](?:\(([^)]*)\))?/,
    groups: ['content', 'name'],
    reverse: ({ name, content }) =>
      name != content ? `[${content}](${name})` : `[${content}]`,
    process: ({ name, ...node }) => ({
      name: name || node.content,
      ...node,
    }),
  },
  em: {
    // emphasized inline text
    inline,
    pattern: /([_\*])(.+?)\1/,
    groups: ['sym', 'content'],
    reverse: ({ content }) => `_${content}_`,
  },
  place: {
    // placement of images, pullquotes, asides etc.
    leaf,
    pattern: /^ *\[\[ *(.*?)(?: *\| *(.*?))? *\]\] *$/,
    groups: ['name', 'flags'],
    reverse: ({ name, flags = '' }) =>
      `\n[[ ${name}${flags && ' | '}${flags} ]]\n`,
  },
  blockTag: {
    // markup tag for paragraphs
    pattern: /^@(\S+?): ?(.*)$/,
    groups: ['tag', 'content'],
    reverse: ({ tag, content }) => {
      const space = R.contains(tag, ['bt', 'mt', 'spm', 'tingo']) ? '\n' : ''
      return `${space}@${tag}: ${content}`
    },
    process: R.evolve({ tag: makeFuzzer(TAGS, 0.5) }), // fuzzy match
  },
  listItem: {
    // renders to html list
    pattern: /^(?:\* |# |@li:) *(.*)$/,
    order: 9,
    reverse: ({ content }) => `# ${content}`,
  },
  comment: {
    // inline comment is only uppercase characters
    pattern: /^[^\na-zøæå]{10,}$/,
    order: 99,
    reverse: ({ content }) => `\n${content}\n`,
  },
  paragraph: {
    // default paragraph block for body text
    pattern: /^.*$/,
    order: 100,
    // reverse: ({ content }) => `    ${content}`,
  },
  aside: {
    // aside
    pattern: /^@fakta:\s?((\n?.+)+)$/,
    order: 1,
    reverse: ({ content }) => `\n@fakta: ${content}\n`,
  },
  pullquote: {
    pattern: /^@sitat:\s?((.+\n?)+)$/i,
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

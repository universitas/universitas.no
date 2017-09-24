export const cleanup = text => {
  return text
    .replace(/^(@\S+:)/gm, s => s.toLowerCase())
    .replace(/^ *(@\S+:) *\b/gm, '$1 ')
    .replace(/^@t: */gm, '@txt: ')
    .replace(/[«"]([^"»«]*)"/g, '«$1»')
    .replace(/"/g, '«')
    .replace(/--/g, '–')
    .replace(/^[-–] *\b/gm, '– ')
    .replace(/^@text:/gm, '@txt:')
    .replace(/\n+@m$/gm, '\n\n@mt: ')
    .replace(/^./gm, s => s.toUpperCase())
}

// :: * -> string
export const stringify = R.cond([
  [R.is(String), R.identity],
  [R.isNil, R.always('')],
  [R.T, R.toString],
])

import { makeFuzzer } from 'utils/text'

export const CREDITS = {
  by: 'Av',
  text: 'Tekst',
  video: 'Video',
  photo: 'Foto',
  illustration: 'Illustrasjon',
  graphics: 'Grafikk',
  translation: 'Oversettelse',
  'text and photo': 'Tekst og foto',
  'text and video': 'Tekst og video',
  'photo and video': 'Foto og video',
}

const propOrIdentity = R.curry((obj, key) => R.defaultTo(key, R.prop(key, obj)))

const fuzzyCredit = R.pipe(
  R.defaultTo('by'),
  makeFuzzer(R.reduce(R.concat, [], R.toPairs(CREDITS)), 0.2),
  propOrIdentity(R.invertObj(CREDITS)),
)

// :: "byline" -> {byline}
export const parseByline = name => {
  const regex = /^(?:(\S.+?): *)?([^,]*)(?:, *(\S.+))?$/
  const match = regex.exec(name)
  if (!match) return { credit: 'by', name }
  return R.pipe(
    g => ({ credit: g[1], name: g[2], title: g[3] }),
    R.over(R.lensProp('credit'), fuzzyCredit),
  )(match)
}

// :: {byline} -> "byline"
export const renderByline = ({ credit = '', name, title = '' }) =>
  `${credit}${credit && ': '}${name}${title && ', '}${title}`

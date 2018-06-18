import { renderByline, parseByline, CREDITS } from './byline'

describe('parseByline', () => {
  const cases = [
    { name: 'Håken Lid' },
    { name: 'Kris', title: 'Velferdstinget' },
    { credit: 'photo', name: 'N.N', title: 'journalist' },
    { name: 'FOOOBAR' },
  ]

  R.forEach(obj => {
    const bl = renderByline(obj)
    test(bl, () => expect(parseByline(bl)).toMatchObject(obj))
  }, cases)
})

describe('fuzzy byline credit', () => {
  const name = 'N.N'
  R.forEachObjIndexed(
    (nor, credit, _) =>
      test(nor, () =>
        expect(parseByline(`${nor}: ${name}`)).toMatchObject({ name, credit }),
      ),
    CREDITS,
  )
})

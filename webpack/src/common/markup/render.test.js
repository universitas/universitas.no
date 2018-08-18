import { inlineText } from './render.js'
import renderer from 'react-test-renderer'

const render = jsx => renderer.create(jsx).toJSON()

const cases = [
  ['hello', ['hello']],
  ['hello _world_!', ['hello ', <em>world</em>, '!']],
]

describe('inlineText', () => {
  for (const [input, output] of cases) {
    test(input, () => {
      for (const [a, b] of R.zip(inlineText(input), output))
        expect(render(a)).toEqual(render(b))
    })
  }
})

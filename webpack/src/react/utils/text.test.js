import { cleanup, stringify } from './text'

test('cleanup', () => {
  expect(cleanup('')).toEqual('')
  expect(cleanup('@text: --@text')).toEqual('@txt: –@text')
  expect(cleanup('hello "hello"')).toEqual('Hello «hello»')
  expect(cleanup('@t:«hello"')).toEqual('@txt: «hello»')
})

test('stringify', () => {
  expect(stringify({ foo: 'bar' })).toEqual('{"foo": "bar"}')
  expect(stringify('foobar')).toEqual('foobar')
  expect(stringify(2)).toEqual('2')
  expect(stringify(undefined)).toEqual('')
  expect(stringify(null)).toEqual('')
})

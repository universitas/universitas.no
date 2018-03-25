import { utf8Decode, formatFileSize, cleanup, stringify } from './text'

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

test('formatFileSize', () => {
  expect(formatFileSize(123)).toEqual('123 B')
  expect(formatFileSize(12345)).toEqual('12.3 kB')
  expect(formatFileSize(1234567)).toEqual('1.23 MB')
  expect(formatFileSize(12345678900)).toEqual('12.3 GB')
  expect(formatFileSize(12345, 5)).toEqual('12.345 kB')
  expect(formatFileSize(1234567, 5)).toEqual('1.2346 MB')
})

test('utf8Decode', () => {
  expect(utf8Decode('hello')).toEqual('hello')
  expect(utf8Decode('«Håken»')).toEqual('«Håken»')
  expect(utf8Decode('Â«HÃ¥kenÂ»')).toEqual('«Håken»')
})

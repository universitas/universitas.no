import * as R from 'ramda'
import {
  extractExifTags,
  exifString,
  exifDateTime,
  humanizeFileSize,
} from './processImageData'

const inputExif = {
  DateTime: '2008:11:21 05:43:03',
  Artist: 'Knut StrÃ¸m', // utf8
  ImageDescription: 'Do not copy     ', // extra spaces
  DateTimeOriginal: '2008:10:28 18:19:44', // preference over DateTime
}

const expectExif = {
  date: new Date('2008-10-28 18:19:44'),
  artist: 'Knut Strøm',
  description: 'Do not copy',
}

test('exifString', () => {
  expect(exifString(inputExif.Artist)).toEqual(expectExif.artist)
})

test('exifDateTime', () => {
  expect(exifDateTime(inputExif.DateTimeOriginal)).toEqual(expectExif.date)
})

test('extractExifTags', () => {
  expect(extractExifTags(inputExif)).toEqual(expectExif)
  // fallback to `DateTime`
  expect(
    extractExifTags(R.dissoc('DateTimeOriginal', inputExif)).date.valueOf()
  ).toBeGreaterThan(expectExif.date.valueOf())
})

test('humanizeFileSize', () => {
  expect(humanizeFileSize(123)).toEqual('123 B')
  expect(humanizeFileSize(12345)).toEqual('12.3 kB')
  expect(humanizeFileSize(1234567)).toEqual('1.23 MB')
  expect(humanizeFileSize(12345678900)).toEqual('12.3 GB')
})

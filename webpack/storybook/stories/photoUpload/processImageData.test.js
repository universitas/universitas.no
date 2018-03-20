import {
  extractExifTags,
  exifString,
  exifDateTime,
  humanizeFileSize,
} from './processImageData'

const fixtureExif = {
  DateTime: '2008:11:21 05:43:03',
  Artist: 'Nicolai StrÃ¸m',
  ImageDescription: 'Do not copy',
  DateTimeOriginal: '2008:10:28 18:19:44',
}

const expectExif = {
  date: new Date('2008-10-28 18:19:44'),
  artist: 'Nicolai Strøm',
  description: 'Do not copy',
}

test('exifString', () => {
  expect(exifString(fixtureExif.Artist)).toEqual(expectExif.artist)
})

test('exifDateTime', () => {
  expect(exifDateTime(fixtureExif.DateTimeOriginal)).toEqual(expectExif.date)
})

test('extractExifTags', () => {
  expect(extractExifTags(fixtureExif)).toEqual(expectExif)
})

test('humanizeFileSize', () => {
  expect(humanizeFileSize(123)).toEqual('123 B')
  expect(humanizeFileSize(12345)).toEqual('12.3 kB')
  expect(humanizeFileSize(1234567)).toEqual('1.23 MB')
  expect(humanizeFileSize(12345678900)).toEqual('12.3 GB')
})

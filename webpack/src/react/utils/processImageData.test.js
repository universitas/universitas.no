import * as R from 'ramda'
import {
  extractExifTags,
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
  created: new Date('2008-10-28 18:19:44'),
  artist: 'Knut Strøm',
  description: 'Do not copy',
  imageId: undefined,
}

test('exifDateTime', () => {
  expect(exifDateTime(inputExif.DateTimeOriginal)).toEqual(expectExif.created)
})

test('extractExifTags', () => {
  expect(extractExifTags(inputExif)).toEqual(expectExif)
  // fallback to `DateTime`
  expect(
    extractExifTags(R.dissoc('DateTimeOriginal', inputExif)).created.valueOf()
  ).toBeGreaterThan(expectExif.created.valueOf())
})

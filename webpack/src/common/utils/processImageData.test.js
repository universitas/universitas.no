import * as R from 'ramda'
import {
  artistFromDescription,
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
    extractExifTags(R.dissoc('DateTimeOriginal', inputExif)).created.valueOf(),
  ).toBeGreaterThan(expectExif.created.valueOf())
})

test('extractExifTags artist from description', () => {
  expect(
    artistFromDescription({ description: 'foo bar\nFotograf: Foo Bar.' }),
  ).toMatchObject({ artist: 'Foo Bar', description: 'foo bar' })
  expect(
    artistFromDescription({
      description:
        'Oslo, Norge, 17.06.2015. Helge Blakkisrud. Pressebilder for Norsk Utenrikspolitisk Institutt (NUPI) Photo: Christopher Olssøn 2014©littleimagebank',
    }),
  ).toMatchObject({ artist: 'Christopher Olssøn 2014©littleimagebank' })
})

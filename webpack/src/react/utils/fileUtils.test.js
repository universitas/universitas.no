import { slugifyFilename } from 'utils/fileUtils'

test('slugifyFilename', () => {
  expect(
    slugifyFilename({
      filename: 'Hello World_()',
      mimetype: 'image/jpeg',
    })
  ).toEqual('Hello-World.jpg')
  expect(
    slugifyFilename({
      filename: '   hello.png',
      mimetype: 'image/png',
    })
  ).toEqual('hello.png')
})

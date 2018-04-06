import { createFile } from './addFileList'
import { default as md5, fileChunks } from './md5hasher'
import SparkMD5 from 'spark-md5'

import path from 'path'

const fixtures = {
  file: [
    path.join(__dirname, 'testfixture.txt'),
    'e2e9cf96cafa1af5f0ff725e61f8fbee',
  ],
  string: ['hello world', '5eb63bbbe01eeed093cb22bb8f5acdc3'],
}

// Smoke test to confirm jsdom and jest test runner can emulate the File API
test('create file works', () => {
  const file = createFile(fixtures.file[0])
  expect(file.constructor.name).toBe('File')
  expect(file.size).toBe(88000)
  expect(file.name).toBe('testfixture.txt')
})

// Smoke test for the SparkMD5 library
test('string md5 hash works', () => {
  expect(SparkMD5).toBeDefined()
  expect(SparkMD5.hash(fixtures.string[0])).toBe(fixtures.string[1])
})

test('get md5 from file', async () => {
  const file = createFile(fixtures.file[0])
  const digest = await md5(file)
  expect(digest).toBe(fixtures.file[1])
  // with small chunk size
  const digest_chunked = await md5(file, 100)
  expect(digest).toBe(fixtures.file[1])
})

test('fileChunks can be iterated', () => {
  const file = createFile(fixtures.file[0])
  for (const chunk of fileChunks(file, 22000)) {
    expect(chunk.constructor.name).toBe('Blob')
    expect(chunk.size).toBe(22000)
  }
})

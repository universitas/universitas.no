import { createFile } from './addFileList'
import md5 from './md5hasher'
import SparkMD5 from 'spark-md5'

import path from 'path'

const fixtureFile = path.join(__dirname, 'configureStore.js')
const fixtureHash = '1f82d53143957b1b38aac949af04b1b8'

test('create file works', () => {
  const file = createFile(fixtureFile)
  expect(file.constructor.name).toBe('File')
  expect(file.size).toBeGreaterThan(5)
  expect(file.name).toBe('configureStore.js')
  expect(file.slice())
})

test('string md5 hash works', () => {
  const md5fixture = ['hello world', '5eb63bbbe01eeed093cb22bb8f5acdc3']
  expect(SparkMD5).toBeDefined()
  expect(SparkMD5.hash(md5fixture[0])).toBe(md5fixture[1])
})

test('get md5 from file', async () => {
  const file = createFile(fixtureFile)
  const digest = await md5(file)
  expect(digest).toBe(fixtureHash)
  // with small chunk size
  const digest_chunked = await md5(file, 100)
  expect(digest).toBe(fixtureHash)
})

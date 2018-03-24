import SparkMD5 from 'spark-md5'

const TWO_MB = 2097152 // 2MB is default chunk size when reading large files

// Generate file chunks for iterative processing
// :: File, Number, Number -> ...Blob
export function* fileChunks(file, chunkSize, start = 0) {
  while (start < file.size) {
    const end = Math.min(file.size, start + chunkSize)
    yield file.slice(start, end)
    start = end
  }
}

// Calculate md5 hash of File or Blob object
// :: (File, Number) -> Promise[String]
const hashFileMD5 = (file, chunkSize = TWO_MB) =>
  new Promise((resolve, reject) => {
    const hasher = new SparkMD5.ArrayBuffer()
    const reader = new FileReader()
    const chunks = fileChunks(file, chunkSize)
    const loadNext = e => {
      const { value: chunk, done } = chunks.next()
      if (reader.result) hasher.append(reader.result)
      if (chunk) reader.readAsArrayBuffer(chunk)
      if (done) resolve(hasher.end()) // return hex digest
    }
    reader.onload = loadNext
    reader.onerror = () => reject(reader.error)
    loadNext()
  })

export default hashFileMD5

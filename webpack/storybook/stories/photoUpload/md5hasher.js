import SparkMD5 from 'spark-md5'

const TWO_MB = 2097152 // Read in fileChunks of 2MB

function* fileChunks(file, chunkSize) {
  let start = 0
  while (start < file.size) {
    const end = Math.min(file.size, start + chunkSize)
    yield file.slice(start, end)
    start = end
  }
}

const hashFileMD5 = (file, chunkSize = TWO_MB) =>
  new Promise((resolve, reject) => {
    const hasher = new SparkMD5.ArrayBuffer()
    const reader = new FileReader()
    const chunks = fileChunks(file, chunkSize)
    function loadNext(e) {
      const { value, done } = chunks.next()
      reader.result && hasher.append(reader.result)
      done && resolve(hasher.end()) // return hex digest
      value && reader.readAsArrayBuffer(value)
    }
    reader.onload = loadNext
    reader.onerror = () => reject(reader.error)
    loadNext()
  })

export default hashFileMD5

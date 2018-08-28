const thumbs = {}
const context = require.context('./thumbs/', true, /\.jpg$/)
context.keys().forEach(key => (thumbs[key.match(/\d+/)[0]] = context(key)))
export default thumbs

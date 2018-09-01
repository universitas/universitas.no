const config = require('../webpack.config.js')
delete config.optimization.splitChunks
config.plugins.pop() // remove BundleTracker
module.exports = config

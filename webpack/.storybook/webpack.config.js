const config = require('../webpack.config.js')
delete config.optimization.splitChunks // storybook has its own chunks
config.plugins.shift() // remove BundleTracker
module.exports = config

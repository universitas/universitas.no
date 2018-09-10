const config = require('../webpack.config.js')
delete config.optimization.splitChunks // storybook has its own chunks
module.exports = {
  ...config,
  plugins: config.plugins.slice(1), // remove bundle plugin
}

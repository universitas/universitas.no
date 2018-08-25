const config = require('../webpack.config.js')
delete config.optimization.splitChunks
module.exports = config

const config = require('./webpack.config.js')
const webpack = require('webpack')

function hotify(entry) {
  return [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    entry,
  ]
}

for (entry in config.entry ){
  config.entry[entry] = hotify(config.entry[entry])
}
// config.plugins.push(new webpack.HotModuleReplacementPlugin())
// config.plugins.push(new webpack.NamedModulesPlugin())

config.devtool = 'eval'
config.output.publicPath = 'http://localhost:3000/static/'
config.devServer = {
  port: 3000,
  host: '0.0.0.0',
  publicPath: 'http://localhost:3000/static/',
  contentBase: false,
  compress: false,
}

module.exports = config

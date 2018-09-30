const config = require('./webpack.config.js')
const webpack = require('webpack')
// config.devtool = 'eval'  // fast rebuild times
config.devtool = 'cheap-module-source-map' // also fast
config.mode = 'development'

const PORT = process.env.HOST_PORT || 3000
const HOST = process.env.SITE_URL || 'localhost'

function hotify(entry) {
  return [
    'react-hot-loader/patch',
    `webpack-dev-server/client?http://${HOST}:${PORT}`,
    'webpack/hot/only-dev-server',
    entry,
  ]
}

for (let entry in config.entry) {
  config.entry[entry] = hotify(config.entry[entry])
}
config.plugins.push(
  new webpack.HotModuleReplacementPlugin(),
  // enable HMR globally
  new webpack.NamedModulesPlugin(),
  // prints more readable module names in the browser console on HMR updates
  new webpack.NoEmitOnErrorsPlugin(),
  // do not emit compiled assets that include errors
)
// use sourcemaps for sass-loader and css-loader
config.module.rules.forEach(rule => {
  rule.use &&
    rule.use.forEach(use => {
      use.options &&
        'sourceMap' in use.options &&
        (use.options.sourceMap = true)
    })
})

config.devServer = {
  host: '0.0.0.0',
  port: 3000,
  publicPath: config.output.publicPath,
  hot: true,
  // clientLogLevel: 'warning',
  // noInfo: true,
  inline: true,
  historyApiFallback: true,
  headers: { 'Access-Control-Allow-Origin': '*' },
  // contentBase: false,
  // compress: false,
}

module.exports = config

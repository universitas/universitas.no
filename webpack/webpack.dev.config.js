const config = require('./webpack.config.js')
const webpack = require('webpack')
// config.devtool = 'eval'  // fast rebuild times
config.devtool = 'cheap-eval-source-map' // also fast

function hotify(entry) {
  return [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    entry,
  ]
}

for (let entry in config.entry) {
  config.entry[entry] = hotify(config.entry[entry])
}

config.output.publicPath = 'http://localhost:3000/static/'
config.plugins.push(
  new webpack.HotModuleReplacementPlugin(),
  // enable HMR globally
  new webpack.NamedModulesPlugin(),
  // prints more readable module names in the browser console on HMR updates
  new webpack.NoEmitOnErrorsPlugin()
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
  publicPath: 'http://localhost:3000/static/',
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

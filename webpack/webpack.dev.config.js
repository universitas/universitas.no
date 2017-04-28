const config = require('./webpack.config.js')
config.devtool = 'eval'  // fast rebuild times
// config.devtool = 'cheap-eval-source-map'  // also fast

function hotify(entry) {
  return [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    entry,
  ]
}

for (let entry in config.entry ){
  config.entry[entry] = hotify(config.entry[entry])
}

config.output.publicPath = 'http://localhost:3000/static/'

// use sourcemaps for sass-loader and css-loader
config.module.rules.forEach(rule => {
  rule.use && rule.use.forEach(use => {
    use.options && 'sourceMap' in use.options && (use.options.sourceMap = true)
  })
})

config.devServer = {
  port: 3000,
  host: '0.0.0.0',
  publicPath: 'http://localhost:3000/static/',
  contentBase: false,
  compress: false,
}

module.exports = config

const webpack = require('webpack')
const config = require('./webpack.config.js')

// for extracting css into css files
const ExtractTextPlugin = require('extract-text-webpack-plugin')
config.output.filename = '[name].[chunkhash:12].js'
const extractSass = new ExtractTextPlugin({
  filename: '[name].[chunkhash:12].css',
})
config.plugins.push(extractSass)

let sass_loader = config.module.rules[1]
sass_loader.use.shift() // remove javascript style-loader
sass_loader.use = extractSass.extract({
  // wrap sass loader
  fallback: 'style-loader',
  use: sass_loader.use,
})

config.devtool = false
config.plugins.push(
  new webpack.DefinePlugin({
    'process.env': { NODE_ENV: JSON.stringify('production') },
  })
)
config.plugins.push(new webpack.optimize.UglifyJsPlugin())

module.exports = config

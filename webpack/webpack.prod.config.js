const webpack = require('webpack')
const config = require('./webpack.config.js')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')

config.mode = 'production'
// Disable devtool to speed up build
config.devtool = 'source-map'

// Use chunkhash in filenames
const outputhash = '[name].[chunkhash:12]'
config.output.filename = outputhash + '.js'
delete config.output.publicPath

// Plugins
const productionEnv = new webpack.DefinePlugin({
  'process.env': { NODE_ENV: JSON.stringify('production') },
})
// const uglifyJs = new webpack.optimize.UglifyJsPlugin()
const extractSass = new ExtractTextPlugin({ filename: outputhash + '.css' })
const progressBar = new ProgressBarPlugin({ width: 50 })

config.plugins.push(productionEnv, extractSass, progressBar)

// Replace style loader with extract loader
const scssLoader = config.module.rules.find(l => l.test.test('.scss'))
scssLoader.use.shift()
scssLoader.use = extractSass.extract({
  fallback: 'style-loader',
  use: scssLoader.use,
})

module.exports = config

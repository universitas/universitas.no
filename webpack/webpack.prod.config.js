const webpack = require('webpack')
const config = require('./webpack.config.js')
const ExtractTextPlugin = require('extract-text-webpack-plugin');

config.output.filename = '[name].[chunkhash:12].js'
const extractSass = new ExtractTextPlugin({ filename: "universitas.[chunkhash:12].css" });
config.plugins.push(extractSass)
let sass_loader = config.module.rules[1]
sass_loader.use.shift() // remove style-loader
sass_loader.use = extractSass.extract({ fallback: 'style-loader', use: sass_loader.use })

config.devtool = 'source-map'
config.plugins.push(new webpack.optimize.UglifyJsPlugin())

module.exports = config

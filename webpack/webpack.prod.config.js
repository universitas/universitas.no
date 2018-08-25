const webpack = require('webpack')
const config = require('./webpack.config.js')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

config.mode = 'production'
config.devtool = 'source-map'

// Use chunkhash in filenames
const outputhash = '[name].[chunkhash:12]'
config.output.filename = outputhash + '.js'

// Plugins
const productionEnv = new webpack.DefinePlugin({
  'process.env': { NODE_ENV: JSON.stringify('production') },
})
const extractCss = new MiniCssExtractPlugin({ filename: outputhash + '.css' })
const progressBar = new ProgressBarPlugin({ width: 50 })
config.plugins.push(productionEnv, extractCss, progressBar)

config.optimization.minimizer = [
  new OptimizeCssAssetsPlugin({
    cssProcessorOptions: { map: { inline: false } },
  }),
  new UglifyJsPlugin({
    cache: true,
    parallel: 4,
    sourceMap: true,
  }),
]

// Replace style loader with minicssextractplugin loader
const scssLoader = config.module.rules.find(l => l.test.test('.scss'))
scssLoader.use[0] = {
  loader: MiniCssExtractPlugin.loader,
  options: {},
}

module.exports = config

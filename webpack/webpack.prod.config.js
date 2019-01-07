const config = require('./webpack.config.js')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')

config.mode = 'production'
config.devtool = 'source-map'

// Use chunkhash in filenames
const outputhash = '[name].[chunkhash:12]'
config.output.filename = outputhash + '.js'

// Plugins
const extractCss = new MiniCssExtractPlugin({ filename: outputhash + '.css' })
const progressBar = new ProgressBarPlugin({ width: 50 })

config.plugins.push(extractCss, progressBar)

const uglifyJs = new UglifyJsPlugin({
  cache: true,
  parallel: true,
  sourceMap: true,
})
const optimiseCss = new OptimizeCssAssetsPlugin({
  cssProcessorOptions: { map: { inline: false } },
})
config.optimization.minimizer.push(uglifyJs, optimiseCss)

// Replace style loader with minicssextractplugin loader
const scssLoader = config.module.rules.find(l => l.test.test('.scss'))
scssLoader.use[0] = {
  loader: MiniCssExtractPlugin.loader,
  options: {},
}

module.exports = config

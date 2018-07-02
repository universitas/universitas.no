const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const path = require('path')
const config = require('./webpack.config.js')

module.exports = {
  ...config,
  target: 'node',
  mode: 'development',
  externals: [nodeExternals()],
  devtool: 'none',
  entry: { server: 'entrypoints/server.js' },
  output: {
    path: path.resolve('./build'),
    filename: '[name].bundle.js',
    publicPath: 'http://localhost:3000/static/',
  },
  plugins: [new webpack.ProvidePlugin({ React: 'react', R: 'ramda' })],
  module: {
    rules: [
      { test: /\.scss$/, use: [{ loader: 'null-loader' }] },
      ...config.module.rules,
    ],
  },
}

const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const path = require('path')
const config = require('./webpack.config.js')

config.plugins.shift() // remove bundle plugin

module.exports = {
  ...config,
  target: 'node',
  externals: [nodeExternals()],
  devtool: 'none',
  entry: { server: './src/universitas/server.js' },
  output: {
    path: path.resolve('./build'),
    filename: '[name].bundle.js',
    publicPath: 'http://localhost:3000/static/',
  },
  module: {
    rules: [
      { test: /\.scss$/, use: [{ loader: 'null-loader' }] },
      ...config.module.rules,
    ],
  },
}

const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const path = require('path')
const config = require('./webpack.config.js')

module.exports = {
  ...config,
  plugins: config.plugins.slice(1), // remove bundle plugin
  mode: 'production',
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
      {
        // test: /\.(scss|svg|gif|jpg|png|woff|woff2|eot|ttf)$/,
        test: /\.scss$/,
        use: [{ loader: 'null-loader' }],
      },
      ...config.module.rules,
    ],
  },
}

const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const path = require('path')

module.exports = {
  target: 'node',
  mode: 'development',
  externals: [nodeExternals()],
  devtool: 'source-map',
  entry: { server: 'entrypoints/server.js' },
  output: { path: path.resolve('./build'), filename: '[name].bundle.js' },
  plugins: [new webpack.ProvidePlugin({ React: 'react', R: 'ramda' })],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        ],
      },
      {
        test: /\.(svg|gif|jpg|png|woff|woff2|eot|ttf|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              emitFile: false,
              name: 'assets/[name]-[hash:12].[ext]',
              limit: 20000, // inline smaller files in css
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [{ loader: 'null-loader' }],
      },
    ],
  },
  resolve: {
    modules: ['src/react', 'src', 'node_modules'],
    unsafeCache: true,
  },
}

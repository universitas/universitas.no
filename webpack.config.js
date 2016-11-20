var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    stylesheet: './src/stylesheets/universitas.scss',
    javascripts: './src/javascripts/site.js',
  },
  output: {
    path: __dirname + '/built',
    filename: '[name]/universitas.js'
  },
  module: {
    loaders: [
      {
        test: /\.(svg|gif|jpg|png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url'
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract("css-loader!sass-loader")
      }
    ]
  },
  sassLoader: {
    includePaths: [
      path.resolve(__dirname, "./node_modules/zurb-foundation-5/scss/"),
      path.resolve(__dirname, "./node_modules/slick-carousel/")
    ]

  },
  plugins: [
    new ExtractTextPlugin("[name].css")
  ]
}

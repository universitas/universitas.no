var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyPlugin = require('copy-webpack-plugin');
var webpack = require('webpack');

var dest = __dirname + '/build';

module.exports = {
  plugins: [
    new ExtractTextPlugin("stylesheets/universitas.css"),
    new CopyPlugin([
      { from: 'src/fonts', to: dest + '/fonts' },
      { from: 'src/images', to: dest + '/images' },
      { from: 'src/favicon', to: dest + '/favicon' }
    ]),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    })
  ],
  resolve: {
    alias: {
      // use unminified jquery source to enable deduping etc.
      // http://stackoverflow.com/a/28989476/1977847
      jquery: "jquery/src/jquery"
    }
  },
  entry: {
    stylesheets: './src/stylesheets/universitas.scss',
    site: './src/javascripts/site.js',
    head: './src/javascripts/head.js',
    vendor: './src/javascripts/vendor.js'
  },
  output: {
    path: dest,
    filename: 'javascripts/[name].js'
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
}

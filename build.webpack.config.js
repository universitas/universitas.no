// Config for building static assets
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var BundleTracker = require('webpack-bundle-tracker');

var dest = __dirname + '/build/';
var source = __dirname + '/src/';

module.exports = {
  plugins: [
    new ExtractTextPlugin("stylesheets/universitas-[hash:12].css"),
    new webpack.ProvidePlugin({$: "jquery", jQuery: "jquery"}),
    new BundleTracker({indent: '  ', filename: 'webpack-stats.json'}),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin()
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
    filename: 'javascripts/[name]-[hash:12].js'
  },
  module: {
    loaders: [
      {
        test: /\.(svg|gif|jpg|png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url?name=assets/[name]-[hash:12].[ext]&limit=10000'
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

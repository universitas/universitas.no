const path = require('path')
const webpack = require('webpack')
const BundleTracker = require('webpack-bundle-tracker')
const build_dir = process.env.BUILD_DIR || '../build'

module.exports = {
  entry: {
    stylesheets: 'stylesheets/universitas.scss',
    head: 'javascripts/head.js',
    vendor: 'javascripts/vendor.js',
    foot: 'javascripts/foot.js',
    photo_list_view: 'entry/photo_list_view.js',
    photo_crop_app: 'entry/photo_crop_app.js',
    tassen_tags_web_editor: 'entry/tassen_tags_web_editor.js',
    prodsys: 'entry/prodsys.js',
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      React: 'react',
      R: 'ramda',
      PropTypes: 'prop-types',
    }),
    new BundleTracker({
      indent: ' ',
      path: build_dir,
      filename: 'webpack-stats.json',
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'react-common',
      chunks: [
        'prodsys',
        'photo_list_view',
        'photo_crop_app',
        'tassen_tags_web_editor',
      ],
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'webpack-bootstrap',
      minChunks: Infinity,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(svg|gif|jpg|png|woff|woff2|eot|ttf|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'assets/[name]-[hash:12].[ext]',
              limit: 20000,
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader', options: { sourceMap: false } },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [require('autoprefixer')],
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: false,
              includePaths: [
                'node_modules/foundation-sites/scss/',
                'node_modules/slick-carousel/',
              ],
            },
          },
        ],
      },
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
    ],
  },
  resolve: {
    modules: ['src/react', 'src', 'node_modules'],
    unsafeCache: true,
    alias: {
      // use unminified jquery source to enable deduping etc.
      // http://stackoverflow.com/a/28989476/1977847
      jquery: 'jquery/src/jquery',
    },
  },
  output: {
    path: path.join(build_dir, ''),
    filename: '[name].js',
  },
}

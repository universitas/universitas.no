const path = require('path')
const webpack = require('webpack')
const BundleTracker = require('webpack-bundle-tracker')
const build_dir = process.env.BUILD_DIR

module.exports = {
  plugins: [
    new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery' }),
    new BundleTracker({
      indent: ' ',
      path: build_dir,
      filename: 'webpack-stats.json',
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
    modules: ['src', 'src/react', 'node_modules'],
    unsafeCache: true,
    alias: {
      // use unminified jquery source to enable deduping etc.
      // http://stackoverflow.com/a/28989476/1977847
      jquery: 'jquery/src/jquery',
    },
  },
  entry: {
    stylesheets: 'stylesheets/universitas.scss',
    head: 'javascripts/head.js',
    vendor: 'javascripts/vendor.js',
    foot: 'javascripts/foot.js',
    photo_list_view: 'entry/photosearch.js',
    // photo_crop_app: 'entry/frontpagecrop.js',
    // tassen_tags_web_editor: 'entry/editor.js',
    // prodsys: 'entry/prodsys.js',
  },
  output: {
    path: path.join(build_dir, ''),
    filename: '[name].js',
  },
}

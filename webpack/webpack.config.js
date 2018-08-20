const path = require('path')
const webpack = require('webpack')
const BundleTracker = require('webpack-bundle-tracker')
const build_dir = process.env.BUILD_DIR || path.resolve('../build')
const publicPath = process.env.PUBLIC_PATH

module.exports = {
  entry: {
    prodsys: './src/entrypoints/prodsys.js',
    universitas: './src/entrypoints/universitas.js',
  },
  output: {
    // for example ../build/head.[hash].js
    publicPath,
    path: path.join(build_dir, ''),
    filename: '[name].js',
  },
  optimization: {
    minimizer: [],
    splitChunks: {
      cacheGroups: {
        commons: {
          name: 'commons',
          minChunks: 2,
          chunks: 'initial',
          priority: -10,
        },
      },
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      // implicitly `import`
      React: 'react',
      R: 'ramda',
      PropTypes: 'prop-types',
    }),
    new BundleTracker({
      // for django integration
      indent: ' ',
      path: build_dir,
      filename: 'webpack-stats.json',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(svg|gif|jpg|png|woff|woff2|eot|ttf)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'assets/[name]-[hash:12].[ext]',
              limit: 20000, // inline smaller files in css
            },
          },
        ],
      },
      {
        test: /\.s?css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader', options: { sourceMap: true } },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              plugins: () => [
                require('autoprefixer')({ grid: false, browsers: ['>5%'] }),
              ],
            },
          },
          { loader: 'sass-loader', options: { sourceMap: true } },
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
    modules: ['src/universitas', 'src/prodsys', 'src/common', 'node_modules'],
    unsafeCache: true,
    alias: {},
  },
}

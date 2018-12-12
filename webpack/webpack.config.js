const path = require('path')
const webpack = require('webpack')
const publicPath = process.env.PUBLIC_PATH || '//localhost:3000/static/'
const build_dir = process.env.BUILD_DIR || path.resolve('./build')

const BundleTracker = require('webpack-bundle-tracker')

// plugin for django integration
const bundler = new BundleTracker({
  indent: ' ',
  path: build_dir,
  filename: 'webpack-stats.json',
})

module.exports = {
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
  entry: {
    prodsys: './src/prodsys/index.js',
    universitas: './src/universitas/index.js',
  },
  output: {
    // for example ../build/head.[hash].js
    publicPath,
    path: build_dir,
    filename: '[name].js',
  },
  plugins: [
    bundler,
    new webpack.ProvidePlugin({
      // implicitly `import`
      React: 'react',
      R: 'ramda',
      PropTypes: 'prop-types',
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
                require('postcss-object-fit-images'),
              ],
            },
          },
          {
            loader: 'sass-loader',
            options: { sourceMap: true, functions: require('chromatic-sass') },
          },
        ],
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        sideEffects: false,
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
    modules: [
      path.resolve(__dirname, './src/'),
      path.resolve(__dirname, './src/common/'),
      path.resolve(__dirname, './src/prodsys/'),
      path.resolve(__dirname, './src/universitas/'),
      'node_modules',
    ],
    extensions: ['.mjs', '.js', '.jsx', '.json'],
    unsafeCache: true,
    alias: {},
  },
}

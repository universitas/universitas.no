const path = require('path')
const webpack = require('webpack')

// load the default config generator.
const genDefaultConfig = require('@storybook/react/dist/server/config/defaults/webpack.config.js')

module.exports = (baseConfig, env) => {
  const config = genDefaultConfig(baseConfig, env)

  config.resolve.modules.push('../src/react') // import modules from here

  config.plugins.push(
    new webpack.ProvidePlugin({
      React: 'react',
      R: 'ramda',
      PropTypes: 'prop-types',
    })
  )
  config.module.rules.push({
    test: /\.scss$/,
    use: [
      { loader: 'style-loader' },
      { loader: 'css-loader', options: { sourceMap: false } },
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: false,
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
  })
  return config
}

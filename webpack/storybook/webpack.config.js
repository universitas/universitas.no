const path = require('path')

// load the default config generator.
const genDefaultConfig = require('@storybook/react/dist/server/config/defaults/webpack.config.js')

module.exports = (baseConfig, env) => {
  const config = genDefaultConfig(baseConfig, env)

  // Extend it as you need.

  config.resolve.modules.push('../src/react')
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

const path = require('path')

// load the default config generator.
const genDefaultConfig = require('@storybook/react/dist/server/config/defaults/webpack.config.js')

module.exports = (baseConfig, env) => {
  const config = genDefaultConfig(baseConfig, env)

  // Extend it as you need.

  config.resolve.modules.push('../src/react')
  return config
}

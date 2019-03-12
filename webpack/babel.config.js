module.exports = function(api) {
  api.cache(true)
  const presets = [
    [
      '@babel/preset-env',
      {
        modules: false, // webpack tree shaking requires this
        useBuiltIns: 'usage', // import only polyfills when needed?
      },
    ],
    '@babel/preset-react',
  ]
  const plugins = [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-proposal-export-default-from',
    ['@babel/plugin-proposal-class-properties', { loose: false }],
  ]
  const env = {
    development: { plugins: ['react-hot-loader/babel'] },
    production: {
      plugins: [['transform-remove-console', { exclude: ['error', 'warn'] }]],
    },
    test: {
      presets: [
        '@babel/preset-env', // modules: false breaks jest
        '@babel/preset-react',
      ],
    },
  }
  return { presets, plugins, env }
}

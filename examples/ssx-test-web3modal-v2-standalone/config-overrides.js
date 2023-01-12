const webpack = require('webpack');

// You can modify the webpack config in here, for instance to add polyfills.
module.exports = function override(config, env) {
  config.resolve.fallback = {
    os: require.resolve('os-browserify/browser'),
    https: require.resolve('https-browserify'),
    http: require.resolve('stream-http'),
    stream: require.resolve('stream-browserify'),
  };
  config.ignoreWarnings = [/Failed to parse source map/];
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  );
  return config;
}

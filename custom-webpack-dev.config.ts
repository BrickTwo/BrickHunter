import type { Configuration } from 'webpack';
const ExtensionReloader = require('webpack-ext-reloader');
const config = require('./custom-webpack.config');

module.exports = {
  ...config,
  mode: 'development',
  plugins: [
    new ExtensionReloader({
      reloadPage: true, // Force the reload of the page also
      entries: {
        // The entries used for the content/background scripts or extension pages
        background: 'background',
        runtime: false,
      },
    }),
  ],
  resolve: {
    fallback: { "timers": require.resolve('timers-browserify') }
  },
} as Configuration;

import type { Configuration } from 'webpack';

module.exports = {
  entry: {
    background: { import: 'src/background.ts', runtime: false },
    legocontentscript: { import: 'src/lego-content-script.ts', runtime: false },
  },
  resolve: {
    //fallback: { "timers": require.resolve('timers-browserify') }
  },
} as Configuration;

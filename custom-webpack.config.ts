import type { Configuration } from 'webpack';

module.exports = {
  entry: {
    background: { import: 'src/background.ts', runtime: false },
    contentscript: { import: 'src/content-script.ts', runtime: false },
  },
  resolve: {
    //fallback: { "timers": require.resolve('timers-browserify') }
  },
} as Configuration;

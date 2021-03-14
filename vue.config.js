module.exports = {
  pages: {
    popup: {
      template: 'public/browser-extension.html',
      entry: './src/popup/main.js',
      title: 'BrickHunter'
    },
    standalone: {
      template: 'public/browser-extension.html',
      entry: './src/standalone/main.js',
      title: 'BrickHunter',
      filename: 'index.html'
    },
    devtools: {
      template: 'public/browser-extension.html',
      entry: './src/devtools/main.js',
      title: 'Devtools'
    }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      // load which style file you want to import globally
      patterns: ['scss/custom.scss'],
    },
    browserExtension: {
      componentOptions: {
        background: {
          entry: 'src/background.js'
        },
        contentScripts: {
          entries: {
            'content-script': [
              'src/content-scripts/content-script.js',
              'src/content-scripts/content-script-order.js'
            ]
          }
        }
      }
    }
  }
}

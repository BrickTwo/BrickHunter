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
    browserExtension: {
      componentOptions: {
        background: {
          entry: 'src/background.js'
        }
      }
    }
  }
}

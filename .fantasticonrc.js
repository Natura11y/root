module.exports = {
  inputDir: './original-svg', // (required)
  outputDir: './dist', // (required)
  fontTypes: ['ttf', 'woff2', 'woff'],
  assetTypes: ['css', 'json', 'html'],
  name: 'natura11y-icons',
  prefix: 'icon',
  selector: '.icon',
  tag: 'span',
  fontsUrl: './fonts',
  formatOptions: {
    json: {
      indent: 3
    }
  },
  pathOptions: {
    json: './dist/natura11y-icons.json',
    css: './dist/natura11y-icons.css',
    html: './dist/index.html',
    ttf: './dist/fonts/natura11y-icons.ttf',
    woff: './dist/fonts/natura11y-icons.woff',
    woff2: './dist/fonts/natura11y-icons.woff2'
  }
};

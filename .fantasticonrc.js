const codepoints = require('./dist/natura11y-icons.json');

module.exports = {
  inputDir: './original-svg', // (required)
  outputDir: './dist', // (required)
  fontTypes: ['ttf', 'woff2', 'woff'],
  assetTypes: ['css', 'json', 'html'],
  name: 'natura11y-icons',
  codepoints: codepoints,
  prefix: 'icon',
  selector: '.icon',
  tag: 'span',
  formatOptions: {
    json: {
      indent: 3
    }
  },
  pathOptions: {
    html: './dist/index.html',
    css: './dist/natura11y-icons.css',
    json: './dist/natura11y-icons.json',
    ttf: './dist/natura11y-icons.ttf',
    woff: './dist/natura11y-icons.woff',
    woff2: './dist/natura11y-icons.woff2'
  }
};

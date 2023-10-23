const codepoints = require('./natura11y-icons.json');

module.exports = {
  inputDir: './optimized-svg', // (required)
  outputDir: './dist', // (required)
  fontTypes: ['ttf', 'woff2', 'woff'],
  assetTypes: ['css', 'json', 'html'],
  name: 'natura11y-icons',
  codepoints: codepoints,
  // prefix: null,
  selector: '.icon',
  tag: 'span',
  formatOptions: {
    json: {
      indent: 3
    }
  },
  pathOptions: {
    json: './natura11y-icons.json',
    html: './dist/index.html',
    css: './dist/natura11y-icons.css',
    ttf: './dist/natura11y-icons.ttf',
    woff: './dist/natura11y-icons.woff',
    woff2: './dist/natura11y-icons.woff2'
  }
};
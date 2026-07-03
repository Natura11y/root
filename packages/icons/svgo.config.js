'use strict'

module.exports = {
  multipass: true,
  js2svg: {
    pretty: true,
    indent: 2
  },
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeAttrs: {
            attrs: [
              'data-name',
              'fill',
              'clip-rule'
            ]
          },
          removeUnknownsAndDefaults: {
            keepRoleAttr: true
          },
          removeViewBox: false,
          sortAttrs: true
        }
      }
    },
    // Add cleanupListOfValues as a separate plugin
    'cleanupListOfValues'
  ]
}

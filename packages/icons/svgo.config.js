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
          removeUnknownsAndDefaults: {
            keepRoleAttr: true
          },
          removeViewBox: false,
          sortAttrs: true
        }
      }
    },
    {
      name: 'removeAttrs',
      params: {
        attrs: [
          'data-name',
          'fill',
          'clip-rule'
        ]
      }
    },
    // Add cleanupListOfValues as a separate plugin
    'cleanupListOfValues'
  ]
}

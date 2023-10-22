'use strict';

module.exports = {
	multipass: true,
	js2svg: {
		pretty: true,
		indent: 3,
	},
	plugins: [
		{
			name: 'preset-default',
			params: {
				overrides: {
					cleanupListOfValues: true,
					removeAttrs: {
						attrs: ['data-name', 'fill', 'clip-rule'],
					},
					removeUnknownsAndDefaults: {
						keepRoleAttr: true,
					},
					removeViewBox: false,
					sortAttrs: true,
				},
			},
		},
	],
};

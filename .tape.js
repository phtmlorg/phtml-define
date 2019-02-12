module.exports = {
	'basic': {
		message: 'supports basic usage'
	},
	'basic:preserve': {
		message: 'supports { preserve: true } usage',
		options: {
			preserve: true
		}
	},
	'link': {
		message: 'supports <link rel="html" href="some/path" /> usage'
	},
	'codepen': {
		message: 'supports <link rel="html" href="https://some/url" /> usage'
	},
	'image': {
		message: 'supports slots in attribute values'
	},
	'fallbacks': {
		message: 'handles slot fallbacks'
	}
};

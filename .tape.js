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
	'basic-nested': {
		message: 'supports { transformSlots: true } usage',
		options: {
			transformSlots: true
		}
	},
	'basic-nested:preserve': {
		message: 'supports { transformSlots: true, preserve: true } usage',
		options: {
			transformSlots: true,
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

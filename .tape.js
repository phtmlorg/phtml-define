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
		message: 'supports <link rel="html" href /> usage'
	},
	'image': {
		message: 'supports slots in attribute values'
	},
	'missing': {
		message: 'handles slot fallbacks'
	}
};

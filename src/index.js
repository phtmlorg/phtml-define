import phtml from 'phtml';
import transform from './lib/transform';

export default new phtml.Plugin('phtml-define', opts => {
	const preserve = Object(opts).preserve;
	const overrideCWD = Object(opts).cwd;
	const fileCache = {};

	return root => {
		return transform(root, preserve, overrideCWD, fileCache);
	};
});

import getDefineElements from './get-define-elements';
import transformCustomElements from './transform-custom-elements';

export default function transform (root, opts) {
	return getDefineElements(root, opts).then(
		defines => {
			transformCustomElements(root, opts, defines);

			return defines;
		}
	);
}

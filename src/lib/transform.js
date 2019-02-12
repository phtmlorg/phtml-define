import getDefineElements from './get-define-elements';
import transformCustomElements from './transform-custom-elements';

export default function transform(root, preserve, overrideCWD, fileCache) {
	return getDefineElements(root, preserve, overrideCWD, fileCache).then(
		defines => {
			transformCustomElements(root, preserve, defines);

			return defines;
		}
	);
}

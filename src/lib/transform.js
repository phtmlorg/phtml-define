import getDefineElements from './get-define-elements';
import transformCustomElements from './transform-custom-elements';

export default function transform(root, overrideCWD, fileCache) {
	return getDefineElements(root, overrideCWD, fileCache).then(
		defines => {
			transformCustomElements(root, defines);

			return defines;
		}
	);
}

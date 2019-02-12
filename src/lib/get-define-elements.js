import { Result } from 'phtml';
import path from 'path';
import resolve from './resolve';
import transform from './transform';

export default function getTags(root, overrideCWD, fileCache) {
	const tags = {};

	let promise = Promise.resolve();

	root.walk(node => {
		const isElement = node.type === 'element';

		if (!isElement) {
			return;
		}

		// <link rel="html" href="x" />
		const id = node.name === 'link' && node.attrs.get('href');

		if (id) {
			node.remove();

			const cwd = overrideCWD || path.dirname(node.source.from);
			const src = resolve(id, cwd, fileCache);

			promise = promise.then(
				() => src
			).then(
				result => new Result(result.contents, { from: result.file }).root
			).then(
				childRoot => transform(childRoot, overrideCWD, fileCache)
			).then(
				defines => {
					Object.assign(tags, defines);
				}
			);

			return;
		}

		// <define tag="x-y" />
		const isDefine = node.name === 'define';
		const tag = isDefine && node.attrs.get('tag');
		const isValidTag = tag && isValidTagRegExp.test(tag);

		if (!isValidTag) {
			return;
		}

		tags[tag] = node;
	});

	return promise.then(() => tags);
}

const isValidTagRegExp = /[_a-zA-Z]+[_a-zA-Z0-9-]*-[_a-zA-Z0-9-]+$/;

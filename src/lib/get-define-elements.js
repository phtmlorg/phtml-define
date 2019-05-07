import { Result } from 'phtml';
import path from 'path';
import resolve from './resolve';
import transform from './transform';

// conditionally remove <link rel="html" href /> if not preserving
export default function getDefineElements (root, opts) {
	const defines = {};

	let promise = Promise.resolve();

	// walk the tree looking for <link rel="html" href> and <define>
	root.walk(node => {
		const isElement = node.type === 'element';

		// ignore non-elements
		if (!isElement) {
			return;
		}

		// get the href from <link rel="html" href />
		const href = node.name === 'link' && node.attrs.get('rel') === 'html' && node.attrs.get('href');

		if (href) {
			// conditionally remove the <link> if preserving is disabled
			if (!opts.preserve) {
				node.remove();
			}

			// get the current working directory for the <link>
			const cwd = opts.cwd || path.dirname(node.source.input.from);

			// promise the contents of the href from <link>
			const resolved = resolve(href, cwd, opts.cache);

			promise = promise.then(
				() => resolved
			).then(
				// promise the contents of the href as an AST
				result => new Result(result.contents, { ...result, from: result.file }).root
			).then(
				// transform the <link> AST
				linkroot => transform(linkroot, opts)
			).then(
				// add the <link> defines to the current defines
				linkdefines => {
					Object.assign(defines, linkdefines);
				}
			);

			return;
		}

		// get the tag from <define tag />
		const tag = node.name === 'define' && node.attrs.get('tag');
		const isValidTag = tag && isValidTagRegExp.test(tag);

		// ignore invalid tags
		if (!isValidTag) {
			return;
		}

		// add the <define> to the current defines
		defines[tag] = node;
	});

	// promise the defines
	return promise.then(
		() => defines
	);
}

const isValidTagRegExp = /[_a-zA-Z]+[_a-zA-Z0-9-]*-[_a-zA-Z0-9-]+$/;

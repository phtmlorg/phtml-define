import { Element, Fragment, Text } from 'phtml';
import transformAttrValues from './transform-attr-values';

export default function transformCustomElements (root, opts, defines) {
	root.walk((node, result) => {
		const isValidCustomElement = node.type === 'element' && node.name in defines;

		// ignore non-custom-elements and unknown custom elements
		if (!isValidCustomElement) {
			return;
		}

		// leave template children unprocessed
		if (isTemplateOrTemplateChild(node)) {
			return;
		}

		const defineClone = defines[node.name].clone(null, true);
		const defineSlots = getSlotsFromDefineElement(defineClone);
		const customSlots = getSlotsFromCustomElement(node);

		for (const name in defineSlots) {
			if (name in customSlots) {
				defineSlots[name].replaceWith(customSlots[name]);
			} else {
				defineSlots[name].replaceWith(...defineSlots[name].nodes);
			}
		}

		defineClone.walk(child => {
			if (child.type !== 'element') {
				return;
			}

			transformAttrValues(child.attrs, customSlots);
		});

		const newRoot = replaceNode(node, result, opts, defineClone);

		if (opts.transformSlots){
			transformCustomElements(newRoot, opts, defines);
		}
	});
}

const replaceNode = (node, result, opts, define) => {
    if (opts.preserve) {

		const { nodes } = node;

		// prevent creation of empty <template></template> nodes
		if (!nodes.length) {
			node.nodes.push(...define.nodes);

			return node;
		}

		const hasTemplateSiblings = nodes.some(n => n.name === 'template');

		/* If the template already exists then we just need to finish processing
		 * the sibilings.
		 *
		 * This handles the scenario where there are 2 sibling slot elements and
		 * are using { transformSlots: true }
		 *
		 * <custom-element slot="contents">
		 *   <span slot="left">Left</span>
		 *
		 *   <span slot="right">Right</span>
		 * </custom-element>
		 */

		if (hasTemplateSiblings) {
			return node;
		}

		const template = new Element({
			name: 'template',
			nodes: node.nodes,
			result
		});

		node.nodes.push(template, ...define.nodes);

		return node;
	} else {
		const { parent } = node;

		node.replaceWith(...define.nodes);

		return parent;
	}
}

const isTemplateOrTemplateChild = node => {
	let current = node;

	while(current) {
		if (current.name === 'template') {
			return true;
		}

		current = current.parent;
	}

	return false;
}

const getSlotsFromDefineElement = node => {
	const slots = {};

	node.walk(child => {
		const isSlot = child.type === 'element' && child.name === 'slot';
		const name = isSlot && child.attrs.get('name');

		if (!name) {
			return;
		}

		child.attrs.remove('name');

		slots[name] = child;
	});

	return slots;
};

const getSlotsFromCustomElement = node => {
	const slots = {};

	node.attrs.forEach(attr => {
		const slotMatch = attr.name.match(isSlotAttrRegExp);

		if (!slotMatch) {
			return;
		}

		const name = slotMatch[1];

		slots[name] = new Text({ data: attr.value, result: node.result });
	});

	node.walk(child => {
		const isElement = child.type === 'element';

		if (!isElement) {
			return;
		}

		// transform <slot name>
		const slotElementName = child.name === 'slot' && child.attrs.get('name');

		if (slotElementName) {
			const slotElement = new Fragment({ result: node.result });

			slotElement.append(...child.clone(null, true).nodes);

			slots[slotElementName] = slotElement;

			return;
		}

		// transform <x slot>
		const elementSlotName = child.attrs.get('slot');

		if (elementSlotName) {
			const slotElement = child.clone(null, true);

			slotElement.attrs.remove('slot');

			slots[elementSlotName] = slotElement;

			return;
		}
	});

	return slots;
};

const isSlotAttrRegExp = /^slot-([_a-zA-Z]+[_a-zA-Z0-9-]*)$/;

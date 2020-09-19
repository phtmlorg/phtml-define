import { Element, Fragment, Text } from 'phtml';
import transformAttrValues from './transform-attr-values';

export default function transformCustomElements (root, opts, defines) {
	root.walk((node, result) => {
		const isValidCustomElement = node.type === 'element' && node.name in defines;

		// ignore non-custom-elements and unknown custom elements
		if (!isValidCustomElement) {
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

		const { parent } = node;

		if (opts.preserve) {
			const template = new Element({
				name: 'template',
				nodes: node.nodes,
				result
			});

			node.nodes.push(template, ...defineClone.nodes);
		} else {
			node.replaceWith(...defineClone.nodes);
		}

		if (opts.transformSlots) {
			transformCustomElements(parent, opts, defines);
		}
	});
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

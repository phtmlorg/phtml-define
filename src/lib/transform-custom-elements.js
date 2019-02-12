import { Element, Fragment, Text } from 'phtml';
import transformAttrValues from './transform-attr-values';

export default function transformCustomElements(root, preserve, defines) {
	root.walk(node => {
		const isCustomTag = node.type === 'element' && node.name in defines;

		if (!isCustomTag) {
			return;
		}

		const clone = defines[node.name].clone(null, true);
		const slots1 = getSlotsFromDefineElement(clone);
		const slots2 = getSlotFromCustomElement(node);

		for (const name in slots1) {
			if (name in slots2) {
				slots1[name].replaceWith(slots2[name]);
			} else {
				slots1[name].replaceWith(...slots1[name].nodes);
			}
		}

		clone.walk(child => {
			if (child.type !== 'element') {
				return;
			}

			transformAttrValues(child.attrs, slots2);
		});

		if (preserve) {
			const template = new Element({ name: 'template', nodes: node.nodes });

			node.nodes.push(template, ...clone.nodes);
		} else {
			node.replaceWith(...clone.nodes);
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

const getSlotFromCustomElement = node => {
	const slots = {};

	node.attrs.forEach(attr => {
		const slotMatch = attr.name.match(isSlotAttrRegExp);

		if (!slotMatch) {
			return;
		}

		const name = slotMatch[1];

		slots[name] = new Text({ data: attr.value });
	});

	node.walk(child => {
		const isElement = child.type === 'element';

		if (!isElement) {
			return;
		}

		const slotElementName = child.name === 'slot' && child.attrs.get('name');

		if (slotElementName) {
			const slotElement = new Fragment();

			slotElement.append(...child.clone(null, true).nodes);

			slots[slotElementName] = slotElement;

			return;
		}

		const elementName = child.type === 'element' && child.attrs.get('slot');

		if (elementName) {
			const slotElement = child.clone(null, true);

			slotElement.attrs.remove('slot');

			slots[elementName] = slotElement;

			return;
		}
	});

	return slots;
};

const isSlotAttrRegExp = /^slot-([_a-zA-Z]+[_a-zA-Z0-9-]*)$/;

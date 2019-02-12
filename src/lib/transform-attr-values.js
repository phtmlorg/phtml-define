// transform attribute values with ${slot-X} (e.g. some-attribute="before-${slot-X}-after")
export default function transformAttrValues (attrs, slots) {
	attrs.forEach(attr => {
		const hasSlotValues = slotValuesRegExp.test(attr.value);

		// ignore attributes that don’t use ${slot-X}
		if (!hasSlotValues) {
			return;
		}

		// replace ${slot-X} with the slot value of X
		attr.value = attr.value.replace(
			slotValuesRegExp,
			($0, name, fallback) => name in slots
				? String(slots[name])
			: fallback
				? fallback
			: ''
		);
	});
}

// attribute values that use ${slot-X}, where X is the slot
const slotValuesRegExp = /\$\{slot-([_a-zA-Z]+[_a-zA-Z0-9-]*)(?:,([^}]+))?\}/g;

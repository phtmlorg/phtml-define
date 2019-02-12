// transform attribute values that use ${slot-X} (attribute-name="before-${slot-X}-after") where X is the slot
export default function transformAttrValues(attrs, slots) {
	attrs.forEach(attr => {
		const hasSlotValues = slotValuesRegExp.test(attr.value);

		if (hasSlotValues) {
			attr.value = attr.value.replace(slotValuesRegExp, ($0, name) => {
				if (name in slots) {
					return String(slots[name]);
				}

				return $0;
			});
		}
	});
}

// attribute values that use ${slot-X}, where X is the slot
const slotValuesRegExp = /\$\{slot-([_a-zA-Z]+[_a-zA-Z0-9-]*)\}/g;

import { registry } from "@web/core/registry";
import { standardFieldProps } from "@web/views/fields/standard_field_props";
import { Component, xml } from "@odoo/owl";

class BooleanSelect extends Component {
    setup() {
        this.trueLabel = this.props.options?.trueLabel || "Yes";
        this.falseLabel = this.props.options?.falseLabel || "No";
    }

    onChange(ev) {
        const value = ev.target.value === "true";
        this.props.update(value);
    }
}

BooleanSelect.template = xml`
    <select t-att-value="props.value" t-on-change="onChange">
        <option t-att-value="true" t-att-selected="props.value === true"><t t-esc="trueLabel"/></option>
        <option t-att-value="false" t-att-selected="props.value === false"><t t-esc="falseLabel"/></option>
    </select>
`;

BooleanSelect.props = {
    ...standardFieldProps,
    options: { type: Object, optional: true },
};
BooleanSelect.supportedTypes = ["boolean"];

registry.category("fields").add("boolean_select", BooleanSelect);

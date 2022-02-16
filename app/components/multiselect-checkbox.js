import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

class Checkbox {
  @tracked checked;

  constructor(checked, value, onchange) {
    this.checked = checked;
    this.value = value;
    this.onchange = onchange;
  }

  get isChecked() {
    return this.checked;
  }

  set isChecked(checked) {
    this.checked = checked;
    this.onchange(this.checked, this.value);
  }
}

export default class MultiselectCheckboxComponent extends Component {
  get checkboxes() {
    let uniqueField = this.args.uniqueField || 'path';
    return this.args.items.map((item) => {
      let checked = this.args.selectedItems.findBy(
        uniqueField,
        item[uniqueField]
      );

      return new Checkbox(checked, item, this.args.onchange);
    });
  }
}

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { A } from '@ember/array';
import { set, action } from '@ember/object';

const AVAILABLE = 'available';

export default class FilesTableComponent extends Component {
  @tracked selectedFiles = A();
  @tracked fileItems;

  constructor() {
    super(...arguments);
    this.fileItems = this.args.files.map((file) => {
      return { ...file, checked: false };
    });
  }

  get allSelected() {
    return this.selectedFiles.length && !this.indeterminate;
  }

  get indeterminate() {
    return (
      this.selectedFiles.length &&
      this.selectedFiles.length !== this.args.files.length
    );
  }

  get selectedCount() {
    return this.selectedFiles.length;
  }

  get downloadDisabled() {
    return (
      !this.selectedCount ||
      !this.selectedFiles.some(function (file) {
        return file.checked && file.status === AVAILABLE;
      })
    );
  }

  @action
  updateSelection(event) {
    let checked = event.currentTarget.checked;
    this.fileItems.forEach(function (fileItem) {
      set(fileItem, 'checked', checked);
    });
    if (checked) {
      this.selectedFiles.addObjects(this.fileItems);
    } else {
      this.selectedFiles.clear();
    }
  }

  @action
  updateSelected(file) {
    let checked = !file.checked;
    if (checked) {
      file.checked = !file.checked;
      this.selectedFiles.addObject(file);
    } else {
      this.selectedFiles.removeObject(file);
    }
  }

  @action
  downloadSelected() {
    let availableFiles = this.selectedFiles.filter(function (file) {
      return file.checked && file.status === AVAILABLE;
    });

    let displayData = availableFiles.map(function (file) {
      return `Path: ${file.path}, Device: ${file.device}`;
    });

    alert(displayData.join('\n\n'));
  }
}

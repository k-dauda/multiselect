import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { A } from '@ember/array';
import { action } from '@ember/object';

const AVAILABLE = 'available';

export default class FilesTableComponent extends Component {
  @tracked selectedFiles = A();

  get fileItems() {
    return this.args.files.map((item) => {
      return {
        ...item,
        checked: this.selectedFiles.some(function (selectedItem) {
          return selectedItem.path === item.path;
        }),
      };
    });
  }

  get downloadDisabled() {
    return !this.selectedFiles.some(function (file) {
      return file.checked && file.status === AVAILABLE;
    });
  }

  get selectedCount() {
    return this.selectedFiles.length;
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

  @action
  updateSelection(event) {
    let checked = event.currentTarget.checked;
    if (checked) {
      this.selectedFiles.addObjects(
        this.fileItems.map(function (fileItem) {
          return { ...fileItem, checked: true };
        })
      );
    } else {
      this.selectedFiles.clear();
    }
  }

  @action
  updateCheckbox(file) {
    let checked = !file.checked;
    if (checked) {
      file.checked = checked;
      this.selectedFiles.addObject(file);
    } else {
      let fileItem = this.selectedFiles.findBy('path', file.path);
      this.selectedFiles.removeObject(fileItem);
      fileItem.checked = checked;
    }
  }

  @action
  downloadSelected() {
    let availableFiles = this.selectedFiles.filter(function (file) {
      return file.checked && file.status === AVAILABLE;
    });

    let displayData = availableFiles.map(function (file) {
      return { device: file.device, path: file.path };
    });

    alert(JSON.stringify(displayData));
  }
}

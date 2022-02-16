import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { A } from '@ember/array';
import { action } from '@ember/object';

export default class FilesTableComponent extends Component {
  @tracked selectedFiles = A();

  AVAILABLE = 'available';

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
      !this.selectedFiles.some((file) => file.status === this.AVAILABLE)
    );
  }

  @action
  updateSelection(event) {
    let checked = event.currentTarget.checked;
    if (checked) {
      this.selectedFiles.addObjects(this.args.files);
    } else {
      this.selectedFiles.clear();
    }
  }

  @action
  updateSelected(checked, file) {
    if (checked) {
      this.selectedFiles.addObject(file);
    } else {
      this.selectedFiles.removeObject(file);
    }
  }

  @action
  downloadSelected() {
    let availableFiles = this.selectedFiles
      .filter((file) => {
        return file.status === this.AVAILABLE;
      })
      .map(function (file) {
        return `Path: ${file.path}, Device: ${file.device}`;
      });

    alert(availableFiles.join('\n\n'));
  }
}

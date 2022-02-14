import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

const SELECTORS = {
  SELECT_ALL_HEADER: '[data-test-select-all-header]',
  SELECT_ALL_CHECKBOX: '#select-all',
  DOWNLOAD_SELECTED_HEADER: '[data-test-download-selected-header]',
  DOWNLOAD_SELECTED_BUTTON: '.download-available-files',
  NAME_HEADER: '[data-test-name-table-header]',
  DEVICE_HEADER: '[data-test-device-table-header]',
  PATH_HEADER: '[data-test-path-table-header]',
  STATUS_HEADER: '[data-test-status-table-header]',
  TABLE_ROW: '[data-test-table-row="$index"]',
  NAME: '.name',
  DEVICE: '.device',
  PATH: '.path',
  STATUS: '.status',
};

let getRowCellSelectors = function (index) {
  let rowSelector = SELECTORS.TABLE_ROW.replace('$index', index);

  return {
    nameSelector: `${rowSelector} ${SELECTORS.NAME}`,
    deviceSelector: `${rowSelector}  ${SELECTORS.DEVICE}`,
    pathSelector: `${rowSelector} ${SELECTORS.PATH}`,
    statusSelector: `${rowSelector} ${SELECTORS.STATUS}`,
  };
};

module('Integration | Component | files-table', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.files = [
      {
        name: 'smss.exe',
        device: 'Stark',
        path: '\\Device\\HarddiskVolume2\\Windows\\System32\\smss.exe',
        status: 'scheduled',
      },
      {
        name: 'netsh.exe',
        device: 'Targaryen',
        path: '\\Device\\HarddiskVolume2\\Windows\\System32\\netsh.exe',
        status: 'available',
      },
      {
        name: 'uxtheme.dll',
        device: 'Lanniester',
        path: '\\Device\\HarddiskVolume1\\Windows\\System32\\uxtheme.dll',
        status: 'available',
      },
      {
        name: 'cryptbase.dll',
        device: 'Martell',
        path: '\\Device\\HarddiskVolume1\\Windows\\System32\\cryptbase.dll',
        status: 'scheduled',
      },
      {
        name: '7za.exe',
        device: 'Baratheon',
        path: '\\Device\\HarddiskVolume1\\temp\\7za.exe',
        status: 'scheduled',
      },
    ];
  });

  test('it renders with empty list', async function (assert) {
    this.emptyFiles = [];

    await render(hbs`<FilesTable @files={{this.emptyFiles}} />`);

    // assert
    //   .dom(SELECTORS.SELECT_ALL_CHECKBOX)
    //   .isDisabled('Select all is disabled when there are no files');

    assert
      .dom(SELECTORS.DOWNLOAD_SELECTED_BUTTON)
      .isDisabled('Download selected is disabled with no files');
  });

  test('it renders', async function (assert) {
    await render(hbs`<FilesTable @files={{this.files}} />`);

    assert
      .dom(SELECTORS.SELECT_ALL_HEADER)
      .hasText('None Selected', 'Displays correct selection message');

    assert
      .dom(SELECTORS.SELECT_ALL_CHECKBOX)
      .isEnabled('Select all checkbox is enabled');

    assert
      .dom(SELECTORS.DOWNLOAD_SELECTED_BUTTON)
      .isDisabled('Download selected is disabled with no selections');

    assert
      .dom(SELECTORS.DOWNLOAD_SELECTED_HEADER)
      .hasText('Download Selected', 'Download Selected header is displayed');

    assert
      .dom(SELECTORS.NAME_HEADER)
      .hasText('Name', 'Name header is displayed');

    assert
      .dom(SELECTORS.DEVICE_HEADER)
      .hasText('Device', 'Device header is displayed');

    assert
      .dom(SELECTORS.PATH_HEADER)
      .hasText('Path', 'Path header is displayed');

    assert
      .dom(SELECTORS.STATUS_HEADER)
      .hasText('Status', 'Status header is displayed');

    // check cell contents
    this.files.forEach(function (file, index) {
      let { nameSelector, deviceSelector, pathSelector, statusSelector } =
        getRowCellSelectors(index);

      assert
        .dom(nameSelector)
        .hasText(file.name, `Displays proper name in row ${index}`);

      assert
        .dom(deviceSelector)
        .hasText(file.device, `Displays proper device in row ${index}`);

      assert
        .dom(pathSelector)
        .hasText(file.path, `Displays proper path in row ${index}`);

      assert
        .dom(statusSelector)
        .hasText(file.status, `Displays proper status in row ${index}`);
    });
  });

  /**
   * Select all checkbox, selects/unselects the checkboxes
   * Select all is in indeterminate state when some but not all items are selected
   * number of selected items is displayed next to select all - display "None Selected"
   * Download selected button is disabled if there are no available - even with selections
   * Clicking on download displays the path and device of the selected available files
   * rows should change color on hover and selected
   *
   */
});

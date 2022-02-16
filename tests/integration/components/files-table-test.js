import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

const SELECTORS = {
  SELECT_ALL_LABEL: '[data-test-select-all-label]',
  SELECT_ALL_CHECKBOX: '#select-all',
  DOWNLOAD_SELECTED_BUTTON: '.download-available-files-btn',
  NAME_HEADER: '[data-test-name-table-header]',
  DEVICE_HEADER: '[data-test-device-table-header]',
  PATH_HEADER: '[data-test-path-table-header]',
  STATUS_HEADER: '[data-test-status-table-header]',
  TABLE_ROW: '[data-test-table-row="$index"]',
  FILE_CHECKBOX: '.file-checkbox',
  CHECKED_FILES: '.file-checkbox:checked',
  NAME: '.name',
  DEVICE: '.device',
  PATH: '.path',
  STATUS: '.status',
};

let getRowCellSelectors = function (index) {
  let cellSelectors = [
    SELECTORS.NAME,
    SELECTORS.DEVICE,
    SELECTORS.PATH,
    SELECTORS.STATUS,
  ];

  return cellSelectors.map(function (selector) {
    return `${SELECTORS.TABLE_ROW.replace('$index', index)} ${selector}`;
  });
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
    this.emptyList = [];

    await render(hbs`<FilesTable @files={{this.emptyList}} />`);

    assert
      .dom(SELECTORS.SELECT_ALL_LABEL)
      .hasText('None Selected', 'Displays correct selection message');

    assert
      .dom(SELECTORS.SELECT_ALL_CHECKBOX)
      .isDisabled('Select all checkbox is disabled');

    assert
      .dom(SELECTORS.DOWNLOAD_SELECTED_BUTTON)
      .isDisabled('Download selected is disabled');
  });

  test('it renders', async function (assert) {
    await render(hbs`<FilesTable @files={{this.files}} />`);

    assert
      .dom(SELECTORS.SELECT_ALL_LABEL)
      .hasText('None Selected', 'Displays correct selection message');

    assert
      .dom(SELECTORS.SELECT_ALL_CHECKBOX)
      .isEnabled('Select all checkbox is enabled');

    assert
      .dom(SELECTORS.DOWNLOAD_SELECTED_BUTTON)
      .isDisabled('Download selected is disabled with no selections');

    assert
      .dom(SELECTORS.DOWNLOAD_SELECTED_BUTTON)
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
      let [nameSelector, deviceSelector, pathSelector, statusSelector] =
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

  test('select all checkbox toggles all the file checkboxes', async function (assert) {
    await render(hbs`<FilesTable @files={{this.files}} />`);

    assert.dom(SELECTORS.SELECT_ALL_CHECKBOX).isNotChecked();
    assert.dom(SELECTORS.CHECKED_FILES).doesNotExist();
    assert
      .dom(SELECTORS.DOWNLOAD_SELECTED_BUTTON)
      .isDisabled('Download selected is disabled with no selections');

    // click on select all to select all
    await click(SELECTORS.SELECT_ALL_CHECKBOX);

    assert.dom(SELECTORS.CHECKED_FILES).exists({ count: 5 });

    assert
      .dom(SELECTORS.SELECT_ALL_LABEL)
      .hasText('Selected 5', 'Displays selected count in label');

    assert
      .dom(SELECTORS.DOWNLOAD_SELECTED_BUTTON)
      .isEnabled('Download selected is enabled with selections');

    // click on select all to de-select all
    await click(SELECTORS.SELECT_ALL_CHECKBOX);

    assert.dom(SELECTORS.CHECKED_FILES).doesNotExist();

    assert
      .dom(SELECTORS.DOWNLOAD_SELECTED_BUTTON)
      .isDisabled('Download selected is disabled with no selections');

    // check indeteminate state
    await click(SELECTORS.FILE_CHECKBOX);

    assert
      .dom(SELECTORS.SELECT_ALL_LABEL)
      .hasText('Selected 1', 'Displays selected count in label');

    assert.ok(
      document.querySelector(SELECTORS.SELECT_ALL_CHECKBOX).indeterminate,
      'Select all is in indeterminate state'
    );
  });

  test('it only downloads selected files with a status of available', async function (assert) {
    assert.expect(1);

    let originalAlert = window.alert;
    let expectedData =
      'Path: \\Device\\HarddiskVolume2\\Windows\\System32\\netsh.exe, Device: Targaryen\n\nPath: \\Device\\HarddiskVolume1\\Windows\\System32\\uxtheme.dll, Device: Lanniester';

    window.alert = function (actualData) {
      assert.strictEqual(
        actualData,
        expectedData,
        'Alert displays proper data'
      );
    };

    await render(hbs`<FilesTable @files={{this.files}} />`);
    await click(SELECTORS.SELECT_ALL_CHECKBOX);
    await click(SELECTORS.DOWNLOAD_SELECTED_BUTTON);

    window.alert = originalAlert;
  });
});

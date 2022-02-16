import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

const SELECTORS = {
  CHECKBOXES: '.heroes input[type="checkbox"]',
};

module('Integration | Component | multiselect-checkbox', function (hooks) {
  setupRenderingTest(hooks);

  test('it checks the checkboxes that represent a value in the selectedItems list', async function (assert) {
    this.items = [
      { id: 'batman', name: 'Bruce Wayne' },
      { id: 'superman', name: 'Clark Kent' },
      { id: 'ironman', name: 'Tony Stark' },
      { id: 'spiderman', name: 'Peter Parker' },
    ];

    this.selectedItems = [
      { id: 'batman', name: 'Bruce Wayne' },
      { id: 'superman', name: 'Clark Kent' },
    ];

    await render(hbs`
      <ul class="heroes">
        <MultiselectCheckbox
          @items={{this.items}}
          @selectedItems={{this.selectedItems}}
          @uniqueField="id"
          as |checkbox hero index|
        >
          <li>
            <label id="test-{{index}}">
              <input type="checkbox" for="test-{{index}}" checked={{checkbox.isChecked}} /> {{hero.name}}
            </label>
          </li>
        </MultiselectCheckbox>
      </ul>
    `);

    let checkboxes = document.querySelectorAll(SELECTORS.CHECKBOXES);

    assert.true(checkboxes[0].checked, "Bruce Wayne's checkbox is checked");
    assert.true(checkboxes[1].checked, "Clark Kent's checkbox is checked");
    assert.false(checkboxes[2].checked, "Tony Stark's checkbox is not checked");
    assert.false(
      checkboxes[3].checked,
      "Peter Parker's checkbox is not checked"
    );
  });
});

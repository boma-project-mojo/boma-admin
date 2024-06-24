import Ember from 'ember';
import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, findAll } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | edit-survey', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function (assert) {
    let store = this.owner.lookup('service:store');
    this.set('store', store);
  });

  test('it renders a create question button if the survey is in edit mode', async function (assert) {
    this.set('is_editing_or_new', true);
    let survey = this.store.createRecord('survey');
    await render(
      hbs`<EditSurvey @survey={{this.survey}} @is_editing_or_new={{this.is_editing_or_new}} />`
    );
    assert.dom('[data-test-create-new-question]').hasText('Create Question');
  });

  test('clicking create question button adds another question', async function (assert) {
    this.set('is_editing_or_new', true);

    let survey = this.store.createRecord('survey');

    this.set('survey', survey);

    await render(
      hbs`<EditSurvey @survey={{this.survey}} @is_editing_or_new={{this.is_editing_or_new}} />`
    );

    await click('[data-test-create-new-question]');
    assert
      .dom('[data-test-survey-question-wrap]')
      .exists({ count: 1 }, 'should display 1 question wrap');

    await click('[data-test-create-new-question]');
    assert
      .dom('[data-test-survey-question-wrap]')
      .exists({ count: 2 }, 'should display 2 question wraps');
  });
});

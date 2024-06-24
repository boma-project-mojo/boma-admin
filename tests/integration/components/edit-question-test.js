import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { hbs } from 'ember-cli-htmlbars';
import { render, click, findAll } from '@ember/test-helpers';

module('Integration | Component | edit-question', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function (assert) {
    let store = this.owner.lookup('service:store');
    this.set('store', store);
  });

  test('it renders a create answer button if the survey is in edit mode', async function (assert) {
    this.set('is_editing_or_new', true);
    await render(
      hbs`<EditQuestion @is_editing_or_new={{this.is_editing_or_new}} />`
    );
    assert.dom('[data-test-create-new-answer]').hasText('Create Answer');
  });

  test('clicking create answer button adds another answer', async function (assert) {
    this.set('is_editing_or_new', true);

    let survey = await this.store.createRecord('survey');

    let question = await this.store.createRecord('question', {
      survey: survey,
    });

    this.set('question', question);

    await render(
      hbs`<EditQuestion @question={{this.question}} @is_editing_or_new={{this.is_editing_or_new}} />`
    );

    await click('[data-test-create-new-answer]');
    await assert
      .dom('[data-test-survey-answer-wrap]')
      .exists({ count: 1 }, 'should display 1 answer wraps');
    await click('[data-test-create-new-answer]');
    await assert
      .dom('[data-test-survey-answer-wrap]')
      .exists({ count: 2 }, 'should display 1 answer wraps');
  });
});

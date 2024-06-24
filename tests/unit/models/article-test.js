import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { run } from '@ember/runloop';

module('Unit | Model | article', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('article computed properties return correct values', function (assert) {
    let store = this.owner.lookup('service:store');

    const article = run(() =>
      this.owner.lookup('service:store').createRecord('article', {
        aasm_state: 'published',
        article_type: 'community_article',
      })
    );

    assert.true(
      article.is_published,
      'is_published returns true when aasm_state is "published"'
    );
    assert.true(
      article.is_community_article,
      'is_community_article returns true when article_type is community_article'
    );
  });
});

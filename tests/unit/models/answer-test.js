import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { get } from '@ember/object';

module('Unit | Model | question', function (hooks) {
  setupTest(hooks);

  test('should belongTo question', function (assert) {
    const Answer = this.owner.lookup('service:store').modelFor('answer');

    // lookup the relationship on the user model
    const relationship = Answer.relationshipsByName.get('question');

    assert.equal(
      relationship.key,
      'question',
      'has relationship with question'
    );
    assert.equal(
      relationship.kind,
      'belongsTo',
      'kind of relationship is belongsTo'
    );
  });
});

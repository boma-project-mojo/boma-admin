import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { get } from '@ember/object';

module('Unit | Model | survey', function (hooks) {
  setupTest(hooks);

  test('should have many questions', function (assert) {
    const Survey = this.owner.lookup('service:store').modelFor('survey');

    // lookup the relationship on the user model
    const relationship = Survey.relationshipsByName.get('questions');

    assert.equal(
      relationship.key,
      'questions',
      'has relationship with questions'
    );
    assert.equal(
      relationship.kind,
      'hasMany',
      'kind of relationship is hasMany'
    );
  });
});

import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { get } from '@ember/object';

module('Unit | Model | question', function (hooks) {
  setupTest(hooks);

  test('should belongTo survey', function (assert) {
    const Question = this.owner.lookup('service:store').modelFor('question');

    // lookup the relationship on the user model
    const relationship = Question.relationshipsByName.get('survey');

    assert.equal(relationship.key, 'survey', 'has relationship with survey');
    assert.equal(
      relationship.kind,
      'belongsTo',
      'kind of relationship is belongsTo'
    );
  });

  test('should have many answers', function (assert) {
    const Question = this.owner.lookup('service:store').modelFor('question');

    // lookup the relationship on the user model
    const relationship = Question.relationshipsByName.get('answers');

    assert.equal(relationship.key, 'answers', 'has relationship with answers');
    assert.equal(
      relationship.kind,
      'hasMany',
      'kind of relationship is hasMany'
    );
  });
});

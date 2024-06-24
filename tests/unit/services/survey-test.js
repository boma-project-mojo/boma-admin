import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { run } from '@ember/runloop';

module('Unit | Service | survey', function (hooks) {
  setupTest(hooks);

  test('newSurvey creates a new Survey', function (assert) {
    let service = this.owner.lookup('service:survey');
    let store = this.owner.lookup('service:store');

    const newRecord = run(() => service.newSurvey('AppData::Article', 1));

    const surveys = run(() => store.findAll('survey'));

    assert.equal(surveys.length, 1, 'a new survey has been created');
  });

  test('newQuestion creates a new Question with correct attributes linked to the Survey', function (assert) {
    let service = this.owner.lookup('service:survey');
    let store = this.owner.lookup('service:store');

    const survey = run(() => service.newSurvey('AppData::Article', 1));

    const surveys = run(() => store.findAll('survey'));

    service.newQuestion(survey, 'single_choice', 'question_text').then((q) => {
      assert.equal(
        q.get('question_type'),
        'single_choice',
        'the question type is correct'
      );
      assert.equal(
        q.get('question_text'),
        'question_text',
        'the question text is correct'
      );
      assert.equal(
        survey.get('questions').length,
        1,
        'a new question has been created'
      );
    });
  });

  test('newAnswer creates a new Answer with correct attributes linked to the Question', function (assert) {
    let service = this.owner.lookup('service:survey');
    let store = this.owner.lookup('service:store');

    const survey = run(() => service.newSurvey('AppData::Article', 1));

    const surveys = run(() => store.findAll('survey'));

    service
      .newQuestion(survey, 'single_choice', 'answer_text')
      .then((question) => {
        service.newAnswer(question, 'answer_text').then((answer) => {
          assert.equal(
            answer.get('answer_text'),
            'answer_text',
            'the answer text is correct'
          );
          assert.equal(
            question.get('answers').length,
            1,
            'a new answer has been created'
          );
          service.newAnswer(question, 'answer_text').then((answer) => {
            assert.equal(
              answer.get('answer_text'),
              'answer_text',
              'the answer text is correct'
            );
            assert.equal(
              question.get('answers').length,
              2,
              'a new answer has been created'
            );
          });
        });
      });
  });
});

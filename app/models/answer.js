import DS from 'ember-data';

export default DS.Model.extend({
  question: DS.belongsTo('question', { async: true, inverse: 'answers' }),
  answer_text: DS.attr('string'),
  answer_type: DS.attr('string'),
  total_responses: DS.attr('number'),
});

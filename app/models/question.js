import DS from 'ember-data';

export default DS.Model.extend({
  survey: DS.belongsTo('survey', { async: true, inverse: 'question' }),
  answers: DS.hasMany('answers', { async: true, inverse: 'question' }),
  question_text: DS.attr('string'),
  question_type: DS.attr('string'),
});

import DS from 'ember-data';

export default DS.Model.extend({
  questions: DS.hasMany('questions', { async: true, inverse: 'survey' }),
  article: DS.belongsTo('article', { async: true, inverse: 'surveys' }),
  enable_at: DS.attr('date'),
  disable_at: DS.attr('date'),
});

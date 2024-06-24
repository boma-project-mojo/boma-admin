import DS from 'ember-data';

export default DS.Model.extend({
  venue: DS.belongsTo('venue', { async: true, inverse: 'role' }),
  name: DS.attr('string'),
  resource_id: DS.attr('string'),
  resource_type: DS.attr('string'),
});

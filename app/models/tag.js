import { computed } from '@ember/object';
import DS from 'ember-data';

export default DS.Model.extend({
  articles: DS.hasMany('articles', { async: true, inverse: 'tags' }),
  productions: DS.hasMany('productions', { async: true, inverse: 'tags' }),
  venue: DS.hasMany('venues', { async: true, inverse: 'tags' }),
  name: DS.attr('string'),
  aasm_state: DS.attr('string'),
  tag_type: DS.attr('string'),
  description: DS.attr('string'),
  festival_id: DS.attr(),
  organisation_id: DS.attr(),
  is_published: computed('aasm_state', function () {
    return this.aasm_state == 'published';
  }),
});

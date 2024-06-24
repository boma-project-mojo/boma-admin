import { computed } from '@ember/object';
import DS from 'ember-data';

export default DS.Model.extend({
  events: DS.hasMany('events', { async: true, inverse: 'productions' }),
  venue: DS.belongsTo('venue', { async: true, inverse: null }),
  tags: DS.hasMany('tags', { async: true, inverse: 'productions' }),
  name: DS.attr('string'),
  short_description: DS.attr('string'),
  description: DS.attr('string', { defaultValue: '<p></p>' }),
  external_link: DS.attr('string'),
  video_link: DS.attr('string'),
  ticket_link: DS.attr('string'),
  image_name: DS.attr('string'),
  image_base64: DS.attr('raw'),
  image_local: DS.attr('string'),
  image_thumb: DS.attr('string'),
  image_medium: DS.attr('string'),
  truncated_description: DS.attr('string'),
  truncated_short_description: DS.attr('string'),
  aasm_state: DS.attr('string'),
  is_owner: DS.attr('boolean'),
  can_update: DS.attr('boolean'),
  is_published: computed('aasm_state', function () {
    return this.aasm_state == 'published';
  }),
  is_locked: computed('aasm_state', function () {
    return this.aasm_state == 'locked' || this.aasm_state == 'published';
  }),
  is_not_locked: computed('aasm_state', function () {
    return this.aasm_state != 'locked';
  }),
});

import { computed } from '@ember/object';
import { or } from '@ember/object/computed';
import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  subtitle: DS.attr(),
  name_and_subtitle: DS.attr(),
  lat: DS.attr(),
  long: DS.attr(),
  image_name: DS.attr('string'),
  image_base64: DS.attr('raw'),
  image_local: DS.attr('string'),
  image_thumb: DS.attr('string'),
  image_medium: DS.attr('string'),
  venue_type: DS.attr(),
  description: DS.attr('string', { defaultValue: '<p></p>' }),
  menu: DS.attr('string', { defaultValue: '<p></p>' }),
  truncated_description: DS.attr(),
  truncated_menu: DS.attr('string'),
  events: DS.hasMany('events', { async: true, inverse: 'venue' }),
  users: DS.hasMany('users', { async: true, inverse: null }),
  aasm_state: DS.attr('string'),
  total_events: DS.attr('number'),
  total_productions: DS.attr('number'),
  is_published: computed('aasm_state', function () {
    return this.aasm_state == 'published';
  }),
  is_retailer: computed('aasm_state', 'venue_type', function () {
    return this.venue_type == 'retailer';
  }),
  dietary_requirements: DS.attr(),
  user_names: DS.attr('string'),
  festival_name: DS.attr('string'),
  tags: DS.hasMany('tags', { async: true, inverse: 'venue' }),
  address_line_1: DS.attr('string'),
  address_line_2: DS.attr('string'),
  city: DS.attr('string'),
  postcode: DS.attr('string'),
  hasAddress: or(
    'address_line_1',
    'address_line_2',
    'city',
    'postcode'
  ),
  external_map_link: DS.attr('string'),
  list_order: DS.attr(),
  include_in_clashfinder: DS.attr('boolean', {defaultValue: true}),
  lat: DS.attr(),
  long: DS.attr(),
  allow_concurrent_events: DS.attr(),
});

import { computed } from '@ember/object';
import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  content: DS.attr('string', { defaultValue: '<p></p>' }),
  image_name: DS.attr('string'),
  image_base64: DS.attr('raw'),
  image_local: DS.attr('string'),
  image_thumb: DS.attr('string'),
  aasm_state: DS.attr('string'),
  image_medium: DS.attr('string'),
  is_published: computed('aasm_state', function () {
    return this.aasm_state == 'published';
  }),
});

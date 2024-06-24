import { computed } from '@ember/object';
import DS from 'ember-data';
import { inject as service } from '@ember/service';

export default DS.Model.extend({
  moment: service(),
  productions: DS.hasMany('productions', { async: true, inverse: 'events' }),
  festival: DS.belongsTo('festival', { async: true, inverse: null }),
  venue: DS.belongsTo('venue', { async: true, inverse: 'events' }),
  image_name: DS.attr('string'),
  start_time: DS.attr('string'),
  end_time: DS.attr('string'),
  name: DS.attr('string'),
  description: DS.attr('string'),
  start_time_moment_in_timezone: computed(
    'festival.timezone',
    'start_time',
    function () {
      return this.moment
        .moment(this.start_time)
        .tz(this.get('festival.timezone'));
    }
  ),
  end_time_moment_in_timezone: computed(
    'end_time',
    'festival.timezone',
    function () {
      return this.moment
        .moment(this.end_time)
        .tz(this.get('festival.timezone'));
    }
  ),
  start_time_moment_in_timezone_formatted: computed(
    'festival.timezone',
    'start_time',
    function () {
      try {
        return this.moment
          .moment(this.start_time)
          .tz(this.get('festival.timezone'))
          .format('Do MMM YYYY @ HH:mm z');
      } catch (err) {
        console.log(
          "Can't format start_time_moment_in_timezone_formatted with out a festival"
        );
      }
    }
  ),
  end_time_moment_in_timezone_formatted: computed(
    'end_time',
    'festival.timezone',
    function () {
      try {
        return this.moment
          .moment(this.end_time)
          .tz(this.get('festival.timezone'))
          .format('Do MMM YYYY @ HH:mm z');
      } catch (err) {
        console.log(
          "Can't format start_time_moment_in_timezone_formatted with out a festival"
        );
      }
    }
  ),
  aasm_state: DS.attr('string'),
  is_published: computed('aasm_state', function () {
    return this.aasm_state == 'published';
  }),
  is_cancelled: computed('aasm_state', function () {
    return this.aasm_state == 'cancelled';
  }),
  can_update: DS.attr('boolean'),
  event_type: DS.attr('string'),
  image_name: DS.attr('string'),
  image_base64: DS.attr('raw'),
  image_local: DS.attr('string'),
  image_thumb: DS.attr('string'),
  image_medium: DS.attr('string'),
  creator_has_publisher_token: DS.attr('boolean'),
  external_link: DS.attr('string'),
  audio_stream: DS.attr('boolean'),
  private_event: DS.attr('boolean'),
  total_preferences: DS.attr('number'),
  address: DS.attr('string'),
  featured: DS.attr('boolean'),
  ticket_link: DS.attr(),
});

import { computed } from '@ember/object';
import DS from 'ember-data';
import { inject as service } from '@ember/service';

export default DS.Model.extend({
  moment: service(),
  // production: DS.hasMany('production', { async: true }),
  name: DS.attr('string'),
  start_date: DS.attr('string'),
  end_date: DS.attr('string'),
  start_date_moment_in_timezone: computed(
    'start_date',
    'timezone',
    function () {
      if (this.start_date) {
        return this.moment.moment(this.start_date).tz(this.timezone);
      }
    }
  ),
  end_date_moment_in_timezone: computed('end_date', 'timezone', function () {
    if (this.end_date) {
      return this.moment.moment(this.end_date).tz(this.timezone);
    }
  }),
  start_date_moment_in_timezone_formatted: computed(
    'start_date',
    'timezone',
    function () {
      if (this.start_date) {
        return this.moment
          .moment(this.start_date)
          .tz(this.timezone)
          .format('Do MMM YYYY @ HH:mm z');
      }
    }
  ),
  end_date_moment_in_timezone_formatted: computed(
    'end_date',
    'timezone',
    function () {
      if (this.end_date) {
        return this.moment
          .moment(this.end_date)
          .tz(this.timezone)
          .format('Do MMM YYYY @ HH:mm z');
      }
    }
  ),
  image_name: DS.attr('string'),
  image_base64: DS.attr('raw'),
  image_local: DS.attr('string'),
  image_thumb: DS.attr('string'),
  aasm_state: DS.attr('string'),
  fcm_topic_id: DS.attr('string'),
  community_events_enabled: DS.attr('boolean'),
  timezone: DS.attr('string'),
  use_production_name_for_event_name: DS.attr('boolean'),
  community_articles_enabled: DS.attr('boolean'),
  analysis_enabled: DS.attr('boolean'),
  aasm_state: DS.attr('string'),
  is_published: computed('aasm_state', function () {
    return this.aasm_state == 'published';
  }),
  organisation: DS.belongsTo('organisation', {async: true, inverse: null}),
  list_order: DS.attr(),
  schedule_modal_type: DS.attr(),
  has_articles: DS.attr(),
  bundle_id: DS.attr(),
  enable_festival_mode_at: DS.attr(),
  disable_festival_mode_at: DS.attr(),
  enable_festival_mode_at_moment_in_timezone_formatted: computed(
    'enable_festival_mode_at',
    'end_date',
    'timezone',
    function () {
      if (this.enable_festival_mode_at) {
        return this.moment
          .moment(this.enable_festival_mode_at)
          .tz(this.timezone);
      }
    }
  ),
  disable_festival_mode_at_moment_in_timezone_formatted: computed(
    'disable_festival_mode_at',
    'end_date',
    'timezone',
    function () {
      if (this.disable_festival_mode_at) {
        return this.moment
          .moment(this.disable_festival_mode_at)
          .tz(this.timezone);
      }
    }
  ),
  show_overflow_menu: computed(
    'analysis_enabled',
    'community_events_enabled',
    function () {
      if (this.community_events_enabled || this.analysis_enabled) return true;
    }
  ),
  require_production_images: DS.attr(),
  require_venue_images: DS.attr(),
  feedback_enabled: DS.attr(),
});

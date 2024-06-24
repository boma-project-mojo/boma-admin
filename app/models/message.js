import { computed } from '@ember/object';
import DS from 'ember-data';

export default DS.Model.extend({
  subject: DS.attr('string'),
  body: DS.attr('string'),
  pushed_state: DS.attr('string'),
  topic: DS.attr('string'),
  isSent: computed('pushed_state', function () {
    return this.pushed_state == 'sent';
  }),
  isDraft: computed('pushed_state', function () {
    return this.pushed_state == 'draft';
  }),
  sent_at: DS.attr('string'),
  article_id: DS.attr('number'),
  event_id: DS.attr('number'),
  article: DS.belongsTo('article', {async: true, inverse: 'message'}),
  stream: DS.attr('string'),
  linked_model: DS.attr('raw'),
  message_status: DS.attr('raw'),
  token_type_id: DS.attr(),
  app_version: DS.attr(),
  token_type_name: DS.attr(),
  send_at: DS.attr(),
  address: DS.attr('string'),
});

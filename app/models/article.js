import { computed } from '@ember/object';
import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr(),
  standfirst: DS.attr(),
  content: DS.attr('string', { defaultValue: '<p></p>' }),
  external_link: DS.attr(),
  audio_url: DS.attr(),
  image_thumb: DS.attr('string'),
  image_base64: DS.attr('raw'),
  audio_base64: DS.attr('raw'),
  aasm_state: DS.attr('string'),
  is_published: computed('aasm_state', function () {
    return this.aasm_state == 'published';
  }),
  message: DS.belongsTo('message', { async: true, inverse: 'article' }),
  tags: DS.hasMany('tags', { async: true, inverse: 'articles' }),
  surveys: DS.hasMany('surveys', { async: true, inverse: 'article' }),
  article_type: DS.attr('string'),
  is_community_article: computed('article_type', function () {
    return this.article_type == 'community_article';
  }),
  audio_url: DS.attr(),
  video_url: DS.attr(),
  audio_state: DS.attr(),
  video_state: DS.attr(),
  // video_link: DS.attr('string'),
  creator_has_publisher_token: DS.attr('boolean'),
  total_preferences: DS.attr('number'),
  address: DS.attr('string'),
  publish_at: DS.attr(),
  article_type: DS.attr(),
  created_at: DS.attr('string'),
});

import { computed } from '@ember/object';
import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  community_articles_enabled: DS.attr('boolean'),
  app_versions: DS.attr('raw'),
});

import { underscore } from '@ember/string';
import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  // Ember Data default for this adapter is to expect dasherised attribute names
  // Our API uses underscores.  
  keyForAttribute(attr) {
    return underscore(attr);
  },
});

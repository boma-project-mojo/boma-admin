import { isNone } from '@ember/utils';
import DS from 'ember-data';

export default DS.Transform.extend({
  deserialize: function (serialized) {
    return isNone(serialized) ? {} : serialized;
  },

  serialize: function (deserialized) {
    return isNone(deserialized) ? {} : deserialized;
  },
});

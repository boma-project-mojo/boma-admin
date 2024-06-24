import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  /* 
   * stringJSON
   *
   * Generate a JSON strong to display 
   */
  stringJSON: computed('context', function(){
    return JSON.stringify(this.context, null, 2);
  })
});
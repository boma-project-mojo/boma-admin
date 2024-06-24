/* 

This service handles the state of the isLoading variable when
jQuery AJAX requests are in progress.   

*/

import $ from 'jquery';
import { computed } from '@ember/object';
import Service from '@ember/service';

export default Service.extend({
  init() {
    this._super(...arguments);

    // Recalculate the below computed property on the ajaxStop and ajaxStart events
    const invalidateRequestInProgress = () => {
      this.notifyPropertyChange('dummyProperty');
    };

    $(document).ajaxStart(invalidateRequestInProgress);
    $(document).ajaxStop(invalidateRequestInProgress);
  },
  /* 
   * isLoading
   *
   * returns true if a jquery requst is in progress
   */
  isLoading: computed('dummyProperty', function () {
    return $.active !== 0;
  }),
});

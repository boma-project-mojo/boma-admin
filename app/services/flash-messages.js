/* 

This service provides methods to show and clear messages
shown in the 'flash' DOM element.  

*/

import Service from '@ember/service';

export default Service.extend({
  /* 
   * alertError()
   *
   * Show a error in the 'flash' element with the 
   * message provided.
   * 
   * @message     str     The message to display  
   */
  alertError(message) {
    $('.flash.error').text(message);
    $('.flash.error').addClass('in');
  },
  /* 
   * clearFlash()
   *
   * Clear the flash message
   */
  clearFlash() {
    $('.flash.error').removeClass('in');
  },
});

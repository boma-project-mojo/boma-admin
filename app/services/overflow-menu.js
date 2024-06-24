/* 

For devices with smaller resolutions the header navigation menu is
reduced in width and an 'overflow' menu is provided with an action
to show / hide the additional links.  

This service handles the state of that menu and the action to toggle it.  

*/

import Evented from '@ember/object/evented';
import Service from '@ember/service';

export default Service.extend(Evented, {
  overflowMenuShown: false,
  /* 
   * toggleOverflowMenu()
   *
   * Handle the action to show/hide the overflow menu.  
   */  
  toggleOverflowMenu() {
    this.set('overflowMenuShown', !this.overflowMenuShown);
  },
});

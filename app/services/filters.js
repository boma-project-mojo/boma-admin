/* 

This service maintains the state for the filters panel and includes
a method to show and hide the panel.  

*/

import Evented from '@ember/object/evented';
import Service from '@ember/service';

export default Service.extend(Evented, {
  filtersShown: false,

  /* 
   * toggleFilters()
   *
   * Toggle open and closed the filters panel
   */
  toggleFilters() {
    this.set('filtersShown', !this.filtersShown);
  },
});

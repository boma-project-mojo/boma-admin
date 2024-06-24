import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: '',

  session: service(),
  filters: service(),
  moment: service(),
  overflowMenu: service(),

  // Set the default 'from' and 'to' dates for analysis to one week.  
  analysisFrom: computed(function(){ 
    return this.get('moment').moment().subtract(7, 'days').toString()
  }),
  analysisTo: computed(function () {
    return this.moment.moment().toString();
  }),

  actions: {
    // Logout
    invalidateSession() {
      this.session.invalidate();
    },

    // Toggle the Filters
    toggleFilters(){
      this.filters.toggleFilters();
    },

    // Toggle the 'overflow' menu
    toggleOverflowMenu(){
      this.overflowMenu.toggleOverflowMenu();
    },
  },
});

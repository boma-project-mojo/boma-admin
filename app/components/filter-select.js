import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  tagName: '',
  store: service('store'),
  init() {
    if (this.venue_id) {
      let selectedVenue = this.store.peekRecord('venue', this.venue_id);
      this.set('selectedVenue', selectedVenue);
    }
    this._super(...arguments);
  },
  actions: {
    /* 
     * setSelected()
     *
     * Handle the action when an option is selected
     * 
     * selected       Ember Data Object     The option that has been selected.
     */
    setSelected(selected) {
      this.set('selected', selected);
      this.set('selected_id', selected.id);
    },
    /* 
     * clear()
     *
     * Handle the action to clear the selected option
     */
    clear() {
      this.set('selected', null);
      this.set('selected_id', null);
    },
  },
});

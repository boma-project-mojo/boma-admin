import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Controller, { inject as controller } from '@ember/controller';

export default Controller.extend({
  store: service(),
  router: service(),
  squares: service(),

  applicationController: controller('application'),
  current_user: alias('applicationController.current_user'),

  queryParams: ['page', 'venue_type', 'query'],

  /* 
   * is_retailer
   *
   * returns true if the venue_type is 'retailer'
   */
  is_retailer: computed('venue_type', function () {
    return this.venue_type == 'retailer';
  }),
  /* 
   * is_performance_venue
   *
   * returns true if the venue_type is 'performance'
   */
  is_performance_venue: computed('venue_type', function () {
    return this.venue_type == 'performance';
  }),
  
  newVenue: false,

  actions: {
    /* 
     * addVenue()
     *
     * Handles the user action to create a new Venue
     */
    addVenue() {
      var venue = this.store.createRecord('venue');
      venue.set('venue_type', this.venue_type);
      this.set('newVenue', venue);
    },
    /* 
     * resetNewVenue()
     *
     * Handles the action to reset a new Venue
     */
    resetNewVenue() {
      this.set('newVenue', false);
    },
    /* 
     * refreshModel()
     *
     * Reloads the router model and initialises the controller.
     */
    refreshModel() {
      this.router
        .refresh()
        .then(() => {
          this.set('newVenue', false);
          this.set('page', 1);
        })
        .catch((e) => console.log(e));
    },
  },
});

import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Controller, { inject as controller } from '@ember/controller';

export default Controller.extend({
  store: service(),
  squares: service(),
  router: service(),

  applicationController: controller('application'),
  current_user: alias('applicationController.current_user'),

  queryParams: ['page', 'query', 'venue_id'],
  
  newEvent: false,

  actions: {
    /* 
     * addEvent()
     *
     * Handles the user action to create a new Event
     */
    addEvent() {
      var event = this.store.createRecord('event');
      this.set('newEvent', event);
    },
    /* 
     * resetNewEvent()
     *
     * Handles the action to reset a new event
     */
    resetNewEvent() {
      this.set('newEvent', false);
    },
    /* 
     * refreshModel()
     *
     * Reloads the router model and initialises the controller.
     */
    refreshModel() {
      this.router.refresh(this.fullName).then(() => {
        this.set('newEvent', false);
        this.set('page', 1);
      });
    },
  },
});

import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Controller, { inject as controller } from '@ember/controller';

export default Controller.extend({
  store: service(),
  router: service(),

  applicationController: controller('application'),
  current_user: alias('applicationController.current_user'),
  
  queryParams: ['page', 'query'],
  newUser: false,
  
  actions: {
    /* 
     * addUser()
     *
     * Handles the user action to create a new User
     */
    addUser() {
      var user = this.store.createRecord('user');
      this.set('newUser', user);
    },
    /* 
     * resetNewUser()
     *
     * Handles the action to reset a new User
     */
    resetNewUser() {
      this.set('newUser', false);
    },
    /* 
     * refreshModel()
     *
     * Reloads the router model and initialises the controller.
     */
    refreshModel() {
      this.router.refresh().then(() => {
        this.set('newUser', false);
        this.set('page', 1);
      });
    },
  },
});

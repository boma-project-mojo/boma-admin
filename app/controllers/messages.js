import { alias } from '@ember/object/computed';
import Controller, { inject as controller } from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({  
  store: service(),
  router: service(),

  applicationController: controller('application'),
  current_user: alias('applicationController.current_user'),
  
  actions: {
    /* 
     * addMessage()
     *
     * Handles the user action to create a new Message
     */
    addMessage() {
      var message = this.store.createRecord('message');
      this.set('newMessage', message);
    },
    /* 
     * resetNewMessage()
     *
     * Handles the action to reset a new Message
     */
    resetNewMessage() {
      this.set('newMessage', false);
    },
    /* 
     * refreshModel()
     *
     * Reloads the router model and initialises the controller.
     */
    refreshModel() {
      this.router.refresh(this.fullName).then(() => {
        this.set('newMessage', false);
        this.set('page', 1);
      });
    },
  },
});

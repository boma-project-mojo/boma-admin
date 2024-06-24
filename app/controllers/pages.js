import { alias } from '@ember/object/computed';
import Controller, { inject as controller } from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  infinity: service(),
  router: service(),
  squares: service(),
  store: service(),
  queryParams: ['page', 'query'],
  newPage: false,

  applicationController: controller('application'),
  current_user: alias('applicationController.current_user'),

  actions: {
    /* 
     * addPage()
     *
     * Handles the user action to create a new Page
     */
    addPage() {
      var page = this.store.createRecord('page');
      this.set('newPage', page);
    },
    /* 
     * resetNewPage()
     *
     * Handles the action to reset a new Page
     */
    resetNewPage() {
      this.set('newPage', false);
    },
    /* 
     * refreshModel()
     *
     * Reloads the router model and initialises the controller.
     */
    refreshModel() {
      this.router.refresh(this.fullName).then(() => {
        this.set('newPage', false);
        this.set('page', 1);
      });
    },
  },
});

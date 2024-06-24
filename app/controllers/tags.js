import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Controller, { inject as controller } from '@ember/controller';

export default Controller.extend({
  store: service(),
  router: service(),

  applicationController: controller('application'),
  current_user: alias('applicationController.current_user'),

  queryParams: ['page', 'query'],
  
  newTag: false,
  
  actions: {
    /* 
     * addTag()
     *
     * Handles the user action to create a new Tag
     */
    addTag() {
      var tag = this.store.createRecord('tag');
      this.set('newTag', tag);
    },
    /* 
     * resetNewTag()
     *
     * Handles the action to reset a new Tag
     */
    resetNewTag() {
      this.set('newTag', false);
    },
    /* 
     * refreshModel()
     *
     * Reloads the router model and initialises the controller.
     */
    refreshModel() {
      this.router.refresh(this.fullName).then(() => {
        this.set('newTag', false);
        this.set('page', 1);
      });
    },
  },
});

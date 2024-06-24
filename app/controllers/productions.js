import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Controller, { inject as controller } from '@ember/controller';

export default Controller.extend({
  store: service(),
  router: service(),
  squares: service(),
  saveProductionService: service('saveProduction'),
  
  applicationController: controller('application'),
  current_user: alias('applicationController.current_user'),
  queryParams: ['page', 'query', 'venue_id'],
  newProduction: false,
  isEditing: false,

  actions: {
    /* 
     * addProduction()
     *
     * Handles the user action to create a new Production
     */
    addProduction() {
      var production = this.store.createRecord('production');
      this.set('newProduction', production);
    },
    /* 
     * resetNewProduction()
     *
     * Handles the action to reset a new Production
     */
    resetNewProduction() {
      this.set('newProduction', false);
    },
    /* 
     * saveProduction()
     *
     * Handles the action to save a new Production
     */
    saveProduction(context, resetNewProduction = false) {
      return this.saveProductionService.saveProduction(
        context.get('production'),
        context,
        resetNewProduction
      );
    },
    /* 
     * refreshModel()
     *
     * Reloads the router model and initialises the controller.
     */
    refreshModel() {
      this.router.refresh(this.fullName).then(() => {
        this.set('newProduction', false);
        this.set('page', 1);
      });
    },
  },
});

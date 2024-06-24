import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default Controller.extend({
  store: service(),
  router: service(),
  session: service(),
  
  newFestival: false,

  actions: {
    /* 
     * addFestival()
     *
     * Handles the user action to create a new Festival
     */
    addFestival() {
      var festival = this.store.createRecord('festival');
      this.set('newFestival', festival);
      this.set('isEditing', true);
    },
    /* 
     * resetNewFestival()
     *
     * Handles the action to reset a new festival
     */
    resetNewFestival() {
      this.set('newFestival', false);
    },
    /* 
     * invalidateSession()
     *
     * Log out
     */
    invalidateSession() {
      this.session.invalidate();
    },
    /* 
     * refreshModel()
     *
     * Reloads the router model and initialises the controller.
     */
    refreshModel() {
      this.router.refresh(this.fullName).then(() => {
        this.set('newFestival', false);
        this.set('page', 1);
      });
    },
  },
});

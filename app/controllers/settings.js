import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default Controller.extend({
  store: service(),
  session: service(),
  router: service(),
  
  actions: {
    /* 
     * invalidateSession()
     *
     * Logout
     */
    invalidateSession() {
      this.store.unloadAll();
      this.session.invalidate();
      this.router.transitionTo('login');
    },
  },
});

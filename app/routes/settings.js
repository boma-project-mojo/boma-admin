import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend({
  session: service(),
  currentUserService: service('current-user'),

  beforeModel() {
    this.session.requireAuthentication();
  },

  setupController(controller, model) {
    if (this.get('session.isAuthenticated') === true) {
      controller.set('current_user', this.currentUserService.setUser());
    }
    this._super(controller, model);
  },
});

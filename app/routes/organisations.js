import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default Route.extend({
  store: service(),
  session: service(),
  filters: service(),
  currentUserService: service('current-user'),

  beforeModel() {
    this.session.requireAuthentication();
  },

  model() {
    window.store = this.store;

    return new hash({
      organisations: this.store.findAll('organisation'),
    });
  },
  
  setupController(controller, model) {
    if (this.get('session.isAuthenticated') === true) {
      controller.set('current_user', this.currentUserService.setUser());
    }
    this.filters.set('filtersShown', false);
    controller.set('organisation_id', model.organisation_id);
    this._super(controller, model);
  },
});

import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default Route.extend({
  session: service(),
  store: service(),
  currentUserService: service('current-user'),
  filters: service(),

  beforeModel() {
    this.session.requireAuthentication();
  },

  model(params) {
    window.store = this.store;

    return new hash({
      organisation: this.store.findRecord('organisation', params.organisation_id),
      festivals: this.store.query('festival', {
        organisation_id: params.organisation_id,
      }),
    });
  },

  setupController(controller, model) {
    if (this.get('session.isAuthenticated') === true) {
      controller.set('current_user', this.currentUserService.setUser());
    }

    this.filters.set('filtersShown', false);

    controller.set('organisation_id', model.organisation.id);

    this._super(controller, model);
  },
  
  actions: {
    refreshModel() {
      this.refresh().then(() => {
        this.controller.set('newFestival', false);
        this.controller.set('page', 1);
      });
    },
  },
});

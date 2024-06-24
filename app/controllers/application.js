import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { alias } from '@ember/object/computed';

export default Controller.extend({
  store: service('store'),
  session: service('session'),
  filters: service('filters'),
  overflowMenu: service(),
  router: service(),
  isLoading: false,
  environment: 'production',
  filtersShown: alias('filters.filtersShown'),
  overflowMenuShown: alias('overflowMenu.overflowMenuShown'),
  actions: {
    invalidateSession() {
      this.store.unloadAll();
      this.session.invalidate();
      this.router.transitionTo('login');
    },
  },
});

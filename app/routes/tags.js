import { hash } from 'rsvp';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  infinity: service(),
  store: service(),
  session: service(),
  filters: service(),

  beforeModel() {
    this.session.requireAuthentication();
  },

  model(params) {
    window.store = this.store;
    this.store
      .adapterFor('tag')
      .set('namespace', 'admin_api/v1/festivals/' + params.festival_id);
    return new hash({
      organisation: this.store.findRecord(
        'organisation',
        params.organisation_id
      ),
      festival: this.store.findRecord('festival', params.festival_id),
      tags: this.infinity.model('tag', {
        festival_id: this.festival_id,
        perPageParam: 'per',
        pageParam: 'page',
        query: params.query,
      }),
    });
  },

  setupController(controller, model, transition, params) {
    controller.set('festival_id', model.festival_id);
    this.filters.set('filtersShown', false);
    this._super(controller, model);
  },
  
  actions: {
    refreshModel() {
      this.refresh().then(() => {
        this.controller.set('newTag', false);
        this.controller.set('page', 1);
      });
    },
  },
});

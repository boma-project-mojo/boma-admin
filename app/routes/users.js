import { hash } from 'rsvp';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  store: service(),
  infinity: service(),

  queryParams: {
    page: {
      refreshModel: true,
    },
    query: {
      refreshModel: false,
    },
  },

  model(params) {
    window.store = this.store;
    this.store
      .adapterFor('user')
      .set('namespace', 'admin_api/v1/festivals/' + params.festival_id);
    return new hash({
      organisation: this.store.findRecord(
        'organisation',
        params.organisation_id
      ),
      festival: this.store.findRecord('festival', params.festival_id),
      users: this.infinity.model('user', {
        festival_id: this.festival_id,
        perPageParam: 'per',
        pageParam: 'page',
        query: params.query,
      }),
    });
  },

  setupController(controller, model) {
    controller.set('festival_id', model.festival_id);
    controller.set(
      'venues',
      this.store.query('venue', { venue_type: 'performance' })
    );
    this._super(controller, model);
  },
  
  actions: {
    refreshModel() {
      this.refresh().then(() => {
        this.controller.set('newUser', false);
        this.controller.set('page', 1);
      });
    },
  },
});

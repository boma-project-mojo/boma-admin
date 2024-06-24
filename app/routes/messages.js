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
  },

  model(params) {
    this.store
      .adapterFor('message')
      .set('namespace', 'admin_api/v1/festivals/' + params.festival_id);
    return new hash({
      organisation: this.store.findRecord(
        'organisation',
        params.organisation_id
      ),
      festival: this.store.findRecord('festival', params.festival_id),
      messages: this.infinity.model('message', {
        festival_id: this.festival_id,
        perPageParam: 'per',
        pageParam: 'page',
      }),
      token_types: this.store.findAll('token_type'),
    });
  },
  
  setupController(controller, model, transition, params) {
    controller.set('festival_id', model.festival_id);
    this._super(controller, model);
  },
});

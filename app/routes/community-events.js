import { hash } from 'rsvp';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  infinity: service(),
  store: service(),
  session: service(),

  beforeModel() {
    this.session.requireAuthentication();
  },

  model(params) {
    window.store = this.store;
    this.store
      .adapterFor('event')
      .set('namespace', 'admin_api/v1/festivals/' + params.festival_id);
    this.store
      .adapterFor('venue')
      .set('namespace', 'admin_api/v1/festivals/' + params.festival_id);
    return new hash({
      organisation: this.store.findRecord(
        'organisation',
        params.organisation_id
      ),
      festival: this.store.findRecord('festival', params.festival_id),
      events: this.infinity.model('event', {
        festival_id: params.festival_id,
        event_type: 'community_event',
        perPageParam: 'per',
        pageParam: 'page',
      }),
      venues: this.store.query('venue', { venue_type: 'community_venue' }),
    });
  },

  setupController(controller, model, transition, params) {
    controller.set('festival_id', model.festival_id);
    this._super(controller, model);
  },
});

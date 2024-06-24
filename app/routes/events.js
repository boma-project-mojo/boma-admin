import { hash } from 'rsvp';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  infinity: service(),
  store: service(),
  session: service(),
  tagsService: service('tags'),

  queryParams: {
    page: {
      refreshModel: true,
    },
    query: {
      refreshModel: false,
    },
    venue_id: {
      refreshModel: true,
    },
  },
  
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

    var tags = this.tagsService.getTags(params, 'production');

    return new hash({
      organisation: this.store.findRecord(
        'organisation',
        params.organisation_id
      ),
      festival: this.store.findRecord('festival', params.festival_id),
      events: this.infinity.model('event', {
        festival_id: params.festival_id,
        query: params.query,
        order: 'diary',
        venue_id: params.venue_id,
        perPageParam: 'per',
        pageParam: 'page',
      }),
      tags: tags,
      venues: this.store.query('venue', { venue_type: 'performance' }),
    });
  },

  setupController(controller, model, transition, params) {
    controller.set('festival_id', model.festival_id);
    this._super(controller, model);
  },

  resetController(controller, isExiting, transition) {
    controller.set('venue_id', null);
    controller.set('query', null);
  },
  
  afterModel() {
    this.controllerFor('events').set('isLoading', false);
  },
});

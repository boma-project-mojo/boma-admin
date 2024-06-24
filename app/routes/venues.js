import { hash } from 'rsvp';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  infinity: service(),
  tagsService: service('tags'),
  store: service(),
  session: service(),

  queryParams: {
    page: {
      refreshModel: true,
    },
    venue_type: {
      refreshModel: true,
    },
    query: {
      refreshModel: false,
    },
  },

  beforeModel() {
    this.session.requireAuthentication();
  },

  model(params) {
    window.store = this.store;
    this.store
      .adapterFor('venue')
      .set('namespace', 'admin_api/v1/festivals/' + params.festival_id);

    if (params.venue_type === 'performance') {
      var tags = this.tagsService.getTags(params, 'performance_venue');
    } else if (params.venue_type === 'retailer') {
      var tags = this.tagsService.getTags(params, 'retailer');
    }

    return new hash({
      festival: this.store.findRecord('festival', params.festival_id),
      organisation: this.store.findRecord(
        'organisation',
        params.organisation_id
      ),
      all_tags: tags,
      venues: this.infinity.model('venue', {
        festival_id: this.festival_id,
        venue_type: params.venue_type,
        query: params.query,
        perPageParam: 'per',
        pageParam: 'page',
      }),
    });
  },

  setupController(controller, model, transition, params) {
    controller.set('festival_id', model.festival_id);
    this._super(controller, model);
  },

  actions: {
    refreshModel() {
      this.refresh();
    },
    willTransition(transition) {
      // Reset the query params on route transitions within the venues route
      if (
        transition.intent.queryParams.venue_type !=
          this.controller.get('venue_type') &&
        this.routeName == 'venues' &&
        transition.intent.name == 'venues'
      )
        this.controller.set('query', '');
    },
  },
});

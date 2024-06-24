import { hash } from 'rsvp';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  infinity: service(),
  tagsService: service('tags'),
  store: service(),
  isLoadingService: service('is-loading'),
  session: service(),

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
    tag_id: {
      refreshModel: true,
    },
    acts_without_tags: {
      refreshModel: true,
    },
  },

  beforeModel() {
    this.session.requireAuthentication();
  },

  model(params) {
    window.store = this.store;
    this.store
      .adapterFor('production')
      .set('namespace', 'admin_api/v1/festivals/' + params.festival_id);
    this.store
      .adapterFor('venue')
      .set('namespace', 'admin_api/v1/festivals/' + params.festival_id);

    var tags = this.tagsService.getTags(params, 'production');

    return new hash({
      festival: this.store.findRecord('festival', params.festival_id),
      organisation: this.store.findRecord(
        'organisation',
        params.organisation_id
      ),
      productions: this.infinity.model('production', {
        festival_id: this.festival_id,
        query: params.query,
        venue_id: params.venue_id,
        tag_id: params.tag_id,
        acts_without_tags: params.acts_without_tags,
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
    console.log('doing this?')
    controller.set('venue_id', null);
    controller.set('venue', null);
    controller.set('tag', null);
    controller.set('tag_id', null);
    controller.set('query', null);
  },

  afterModel() {
    this.controllerFor('productions').set('isLoading', false);
  },
  
  actions: {
    refresh() {
      this.refresh().then(() => {
        this.controller.set('newProduction', false);
        this.controller.set('page', 1);
      });
    }
  }
});

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
    article_type: {
      refreshModel: true,
    },
    aasm_state: {
      refreshModel: true,
    },
  },

  beforeModel() {
    this.session.requireAuthentication();
  },

  model(params) {
    window.store = this.store;
    this.store
      .adapterFor('article')
      .set('namespace', 'admin_api/v1/festivals/' + params.festival_id);

    if (params.article_type === 'community_article') {
      var tags = this.tagsService.getTags(params, 'community_article');
    } else {
      var tags = this.tagsService.getTags(params, 'article');
    }

    return new hash({
      organisation: this.store.findRecord(
        'organisation',
        params.organisation_id
      ),
      festival: this.store.findRecord('festival', params.festival_id),
      articles: this.infinity.model('article', {
        festival_id: this.festival_id,
        perPageParam: 'per',
        pageParam: 'page',
        article_type: params.article_type,
        aasm_state: params.aasm_state,
        query: params.query,
      }),
      all_tags: tags,
    });
  },
  
  setupController(controller, model, transition, params) {
    controller.set('festival_id', model.festival_id);
    this._super(controller, model);
  },
});

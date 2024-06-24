import { hash } from 'rsvp';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  // Articles can be scoped by Organisation or Festival
  // NOTE:  Organisation Articles and Festival Articles share the same controller over two separate routes.  
  controllerName: 'articles',
  
  session: service(),
  infinity: service(),
  tagsService: service('tags'),
  store: service(),

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
      .set('namespace', 'admin_api/v1/festivals/' + params.organisation_id);

    if (params.article_type === 'community_article') {
      var tags = this.tagsService.getTags(params, 'community_article');
    } else {
      var tags = this.tagsService.getTags(params, 'article');
    }

    return new hash({
      organisation: this.store.findRecord('organisation', params.organisation_id),
      articles: this.infinity.model('article', {
        organisation_id: params.organisation_id,
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
    controller.set('organisation_id', model.organisation_id);
    this._super(controller, model);
  },
  
  actions: {
    refreshModel() {
      this.refresh().then(() => {
        this.controller.set('newArticle', false);
        this.controller.set('page', 1);
      });
    },
  },
});

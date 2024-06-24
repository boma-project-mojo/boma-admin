import { alias } from '@ember/object/computed';
import Controller, { inject as controller } from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  infinity: service(),
  filters: service(),
  store: service(),
  router: service(),
  squares: service(),

  queryParams: ['page', 'query', 'aasm_state'],

  newArticle: false,

  applicationController: controller('application'),
  current_user: alias('applicationController.current_user'),

  /* 
   * all_article_type
   *
   * Returns an array of objects to populates the article type filter select box.  
   */  
  all_article_type: [
    { name: 'All', id: '' },
    { name: 'Audio', id: 'boma_audio_article' },
    { name: 'News Articles', id: 'boma_news_article' },
    { name: 'Videos', id: 'boma_video_article' },
    { name: 'Boma Article (legacy)', id: 'boma_article' },
  ],

  actions: {
    /* 
     * addArticle()
     *
     * Handles the user action to create a new Article
     */
    addArticle() {
      var article = this.store.createRecord('article');
      this.set('newArticle', article);
    },
    /* 
     * resetNewArticle()
     *
     * Handles the action to reset disable creating of a new article
     */
    resetNewArticle() {
      this.set('newArticle', false);
    },
    /* 
     * refreshModel()
     *
     * Reloads the router model and initialises the controller.
     */
    refreshModel() {
      this.router.refresh(this.fullName).then(() => {
        this.set('newArticle', false);
        this.set('page', 1);
      });
    },
    /* 
     * toggleFilters()
     *
     * Handles the user action to show or hide the filters.  
     */
    toggleFilters() {
      this.filters.toggleFilters();
    },
    /* 
     * setArticleTypeFilter()
     *
     * Handles the action sent when an article_type is selected in the filters.  
     * 
     * @article_type      obj     The object for the article type selected (see all_article_type)
     */
    setArticleTypeFilter(article_type) {
      this.set('selectedArticleType', article_type);
      this.set('article_type', article_type.id);
    },
  },
});

import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import Component from '@ember/component';
import ENV from '../config/environment';
import { alias } from '@ember/object/computed';

export default Component.extend({
  tagName: '',

  currentUserService: service('current-user'),

  store: service(),
  session: service(),
  moment: service(),
  upload: service(),
  squares: service(),

  surveyService: service('survey'),

  init(){
    // Set the current user, used for auth in template.  
    this.set('current_user', this.currentUserService.getUser());
    this._super(...arguments);
  },

  // UI States
  uploadingAudio: alias('upload.uploadingAudio'),
  uploadingAudioPercentageComplete: alias(
    'upload.uploadingAudioPercentageComplete'
  ),
  uploadingVideo: alias('upload.uploadingVideo'),
  uploadingVideoPercentageComplete: alias('upload.uploadingVideoPercentageComplete'),
  is_saving: false,
  is_editing_or_new: computed('is_editing', 'article.isNew', function(){
    return (this.get('article.isNew') === true || this.is_editing === true);
  }),

  // Capturing article_type selected when created/editing article. 
  selectedArticleType: computed('article.article_type', function(){
    return this.all_article_types.find(at => at.id === this.get('article.article_type'));
  }),  


  didRender() {
    this._super(...arguments);
    // Initialise all squares. 
    this.squares.toggleSquare();
  },
  
  actions:{
    /* 
     * edit()
     * 
     * Enable edit mode for this article.  
     */
    edit(){
      this.set('is_editing', true);
    },

    /* 
     * cancelEdit()
     * 
     * Disable editing mode for this production and loose unsaved changes.  
     */
    cancelEdit(){
      this.article.rollbackAttributes();
      this.set('is_editing', false);
    },

    /* 
     * discard()
     * 
     * Discard an unsaved record, cancel creating a new article and reset.  
     */
    discard(){
      if (confirm("Are you sure?")) {
        this.article.deleteRecord();
        this.resetNewArticle();
      } else {
        return false;
      }
    },

    /* 
     *
     * save()
     * 
     * save Article and associated surveys.
     * 
     * resetNewArticle    boolean   if true, new article dialog is initialised.  
     */
    save(resetNewArticle){
      // If uploading audio or video
        // prevent saving as we need to tmp URL from the s3 direct upload to provide to the API
      // else
        // continue to save
      if(this.uploadingAudio === 'Uploading' || this.uploadingVideo == 'Uploading'){
        alert("Sorry, you must wait for the audio and video files to finish uploading before you can save this article.  ")
      }else{
        var self = this;
        this.set('is_saving', true);
        let article = this.article;
        article.set('content', this.content);

        return article.save()
          .then((article)=>{  
            this.get('article.surveys').then((surveys)=>{
              // If the article has surveys attached 
                // save them
              // Otherwise 
                // save and reinitialise.  
              if(surveys.length > 0){
                // NB:  Surveys have been built to have a many to one relationships with a suryeyable model (in this case article), 
                // for now the UI / UX supports just one survey per article, hence this line of code
                surveys.forEach((survey)=>{
                  this.surveyService.saveSurvey(survey).then((response)=>{
                    this.set('is_saving', false);
                    this.set('isScheduling', false);
  
                    if(resetNewArticle){
                      this.resetNewArticle();
                      this.refreshModel();
                      this.upload.reset(article);
                    }else{
                      this.set('is_editing', false);
                      this.set('errors',null);
                      this.upload.reset(article);
                    }
                  }).catch((response)=>{
                    console.log(response)
                  }) 
                })

                
              }else{
                // No survey, save and continue.
                this.set('is_saving', false);
                this.set('isScheduling', false);

                if (resetNewArticle) {
                  this.resetNewArticle();
                  this.refreshModel();
                  this.upload.reset(article);
                }else{
                  this.set('is_editing', false);
                  this.set('errors',null);
                  this.upload.reset(article);
                }
              }
            });
          })
          .catch((response) => {
            this.set('is_saving', false);
            this.set('errors', response.errors);
            this.set('isScheduling', false);
            this.article.set('publish_at', null);
          });
      }
    },

    /* 
     * saveNew()
     *
     * save a new article.  
     */
    saveNew(){
      this.send('save', true);
    },

    /* 
     * delete()
     *
     * Delete a saved article which has been persisted to the API.   
     */
    delete(){
      var self = this;
      if (confirm("Are you sure?")) {
        this.article.destroyRecord().then(function(){
          self.refreshModel();
        });     
      } else {
        return false;
      }
    },

    /* 
     * publish()
     *
     * Update the aasm_state for this article to :published.  
     */
    publish(){
      var self = this;
      var article = this.article;
      article.set('aasm_state', 'published');
      return article.save();
    },

    /* 
     * unpublish()
     *
     * Update the aasm_state for this article to :draft.  
     */
    unpublish(){
      var article = this.article;
      article.set('aasm_state', 'draft');
      return article.save();
    },

    /* 
     * publishLater()
     *
     * Toggle the dialog to schedule publishing of this article for later 
     */  
    publishLater(){
      this.set('isScheduling', true);
    },

    /* 
     * cancelScheduling()
     *
     * Cancel scheduling the publishing of this article for later 
     */  
    cancelScheduling(){
      this.article.set('publish_at', null);
      this.set('isScheduling', false);
    },

    /* 
     * unschedule()
     *
     * Remove an existing scheduled publishing date/time from an article.  s
     */   
    unschedule(){
      this.set('isSaving', true);
      this.article.set('publish_at', null);
      this.article.save().then(() => {
        this.set('isScheduling', false);
        this.set('isSaving', false);
      });
    },

    /* 
     * setArticleType()
     *
     * Set the selected article_type 
     */   
    setArticleType(selected){
      this.set('article.article_type', selected.id)
    },

    /* 
     * createSurvey()
     *
     * Create a new stub survey attached to this article.   
     */   
    createSurvey(){
      this.surveyService.newSurvey('AppData::Article', this.article);
    },
  },
});

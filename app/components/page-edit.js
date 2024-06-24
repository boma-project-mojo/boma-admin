import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  tagName: '',

  is_saving: false,
  is_editing_or_new: computed('is_editing', 'page.isNew', function () {
    return this.get('page.isNew') === true || this.is_editing === true;
  }),
  file_is_loaded: false,

  squares: service(),

  didRender() {
    this._super(...arguments);
    this.squares.toggleSquare();
  },

  actions: {
    /* 
     * delete()
     *
     * Handle the action to Delete a page
     */
    delete() {
      var self = this;
      if (confirm('Are you sure?')) {
        this.page.destroyRecord().then(function () {
          self.refreshModel();
          self.set('file_is_loaded', false);
        });
      } else {
        return false;
      }
    },
    /* 
     * edit()
     *
     * Handle the action to edit a page
     */
    edit() {
      this.set('is_editing', true);
    },
    /* 
     * cancel()
     *
     * Handle the action to cancel editing a page
     */
    cancel() {
      this.page.rollbackAttributes();
      this.set('is_editing', false);
      this.set('file_is_loaded', false);
    },
    /* 
     * discard()
     *
     * Handle the action to discard a new Page
     */
    discard() {
      if (confirm('Are you sure?')) {
        this.page.deleteRecord();
        this.resetNewPage();
      } else {
        return false;
      }
    },
    /* 
     * save()
     *
     * Save an existing page and optionally reset new attributes
     * 
     * @resetNewPage    bool    Set to true to reload the model and reset new page attributes
     */
    save(resetNewPage) {
      this.set('is_saving', true);
      let page = this.page;
      page.set('content', this.content);
      return page
        .save()
        .then(() => {
          this.set('is_saving', false);
          this.set('file_is_loaded', false);
          if (resetNewPage) {
            this.refreshModel();
          } else {
            this.set('is_editing', false);
            this.set('errors', null);
          }
        })
        .catch((response) => {
          this.set('is_saving', false);
          this.set('errors', response.errors);
        });
    },
    /* 
     * saveNew()
     *
     * Handle the action to save a new Page
     */
    saveNew() {
      this.send('save', true);
    }
  },
});

import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  tagName: '',

  squares: service(),

  is_editing_or_new: computed('is_editing', 'tag.isNew', function () {
    return this.get('tag.isNew') === true || this.is_editing === true;
  }),
  selectedTagType: null,
  is_shown_class: computed('is_editing', function () {
    if (this.is_editing === true) {
      return 'active';
    }
  }),
  tagTypes: [
    { name: 'Act / Event', key: 'production' },
    { name: 'Retailer', key: 'retailer' },
    { name: 'Performance Venue', key: 'performance_venue' },
    { name: 'Article', key: 'article' },
    { name: 'Community Noticeboard', key: 'community_article' },
    { name: 'Community Venue', key: 'community_venue' },
  ],

  /* 
   * tagTypeForView
   *
   * Return the tagType human readable name for this tags tag_type
   */
  tagTypeForView: computed('tag.tag_type', 'tagTypes', function () {
    var self = this;
    var index = this.tagTypes.findIndex(function (tagType) {
      return tagType.key == self.get('tag.tag_type');
    });
    if (index >= 0) {
      return this.tagTypes[index].name;
    }
  }),

  actions: {
    /* 
     * delete()
     *
     * Handle the action to delete an existing tag
     */
    delete() {
      var self = this;
      if (confirm('Are you sure?')) {
        this.tag.destroyRecord().then(function () {
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
     * Handle the action to edit an existing tag
     */
    edit() {
      this.set('is_editing', true);
    },
    /* 
     * edit()
     *
     * Handle the action to cancel editing an existing tag
     */
    cancel() {
      this.tag.rollbackAttributes();
      this.set('is_editing', false);
    },
    /* 
     * discard()
     *
     * Handle the action to discard a new unsaved tag
     */
    discard() {
      if (confirm('Are you sure?')) {
        this.tag.deleteRecord();
        this.resetNewTag();
      } else {
        return false;
      }
    },
    /* 
     * save()
     *
     * Save a tag and optionally reset the new tag attributes
     * 
     * @resetNewTag     bool     set to true to reset new tag attributes
     */
    save(resetNewTag) {
      let tag = this.tag;
      return tag
        .save()
        .then(() => {
          if (resetNewTag) {
            this.refreshModel();
            this.resetNewTag();
          } else {
            this.set('is_editing', false);
            this.set('errors', null);
          }
        })
        .catch((response) => {
          console.log(response);
          this.set('errors', response.errors);
        });
    },
    /* 
     * saveNew()
     *
     * Save a new tag
     */
    saveNew() {
      this.send('save', true);
    },
  },
});

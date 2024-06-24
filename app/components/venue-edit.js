import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { task } from 'ember-concurrency';

export default Component.extend({
  tagName: '',

  is_saving: false,
  store: service(),
  squares: service(),
  
  is_editing_or_new: computed('is_editing', 'venue.isNew', function () {
    return this.get('venue.isNew') === true || this.is_editing === true;
  }),
  selectedEditorPermissions: computed('venue.{id,users}', function () {
    return this.get('venue.users').filter((user) => {
      let roles = user.get('roles').filter((role) => {
        return (
          role.get('name') == 'editor' &&
          role.get('resource_id') == this.get('venue.id')
        );
      });
      return roles.length > 0;
    });
  }),

  file_is_loaded: false,

  dietary_requirements: [
    { name: 'Vegetarian', key: 'vegetarian' },
    { name: 'Vegan', key: 'vegan' },
    { name: 'Gluten Free', key: 'gluten_free' },
    { name: 'Dairy Free', key: 'dairy_free' },
    { name: 'Nut Free', key: 'nut_free' },
    { name: 'All Vegan', key: 'all_vegan' },
    { name: 'Vegan Options', key: 'vegan_options' },
    { name: 'kids Meals', key: 'kids_meals' },
  ],

  didInsertElement() {
    this._super(...arguments);
    if (this.venue.isNew) {
      this.squares.goToTop();
    }
  },

  didRender() {
    this._super(...arguments);
    this.squares.toggleSquare();
  },

  actions: {
    /* 
     * delete()
     *
     * Delete an existing record
     */
    delete() {
      var self = this;
      if (confirm('Are you sure?')) {
        this.venue.destroyRecord().then(function () {
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
     * Handle the action to edit an existing record
     */
    edit() {
      this.set('is_editing', true);
    },
    /* 
     * cancel()
     *
     * Handle the action to cancel the editing of an existing record
     */
    cancel() {
      this.venue.rollbackAttributes();
      this.set('is_editing', false);
    },
    /* 
     * discard()
     *
     * Discard creating a new record
     */
    discard() {
      if (confirm('Are you sure?')) {
        this.venue.deleteRecord();
        this.resetNewVenue();
      } else {
        return false;
      }
    },
    /* 
     * save()
     *
     * Save a record and optionally reload the model and reset new attributes
     * 
     */
    save(resetNewVenue) {
      this.set('is_saving', true);
      let venue = this.venue;
      venue.set('description', this.description);
      venue.set('menu', this.menu);
      venue.set('venueType', this.venueType);
      return venue
        .save()
        .then(() => {
          this.set('is_saving', false);
          this.set('file_is_loaded', false);
          if (resetNewVenue) {
            this.refreshModel();
            this.resetNewVenue();
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
     * Save a new venue
     */
    saveNew() {
      this.send('save', true);
    },
  },
});

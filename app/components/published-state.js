import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  tagName: '',
  classNames: ['published-state'],

  init() {
    this.set('current_user', this.currentUserService.getUser());
    this._super(...arguments);
  },

  currentUserService: service('current-user'),

  actions: {
    /* 
     * setState()
     *
     * Make the request to change the aasm_state of a record
     * 
     * state      str     The state the change the aasm_state to
     */
    setState(state) {
      let resource = this.resource;
      resource.set('aasm_state', state);
      return resource.save();
    },
    /* 
     * publish()
     *
     * handle the action to change a model's aasm_state to 'published'
     */
    publish() {
      if (this.confirm) {
        if (confirm('Are you sure you want to publish this?')) {
          return this.send('setState', 'published');
        }
      } else {
        return this.send('setState', 'published');
      }
    },
    /* 
     * unpublish()
     *
     * handle the action to change a model's aasm_state to 'draft'
     */
    unpublish() {
      if (this.confirm) {
        if (confirm('Are you sure you want to unpublish this?')) {
          return this.send('setState', 'draft');
        }
      } else {
        return this.send('setState', 'draft');
      }
    },
    /* 
     * hide()
     *
     * handle the action to change a model's aasm_state to 'hidden'
     */
    hide() {
      return this.send('setState', 'hidden');
    },
  },
});

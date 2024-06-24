import { inject as service } from '@ember/service';
import { or } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  tagName: '', 
  classNames: ['published-state'],

  currentUserService: service('current-user'),

  init() {
    this.set('current_user', this.currentUserService.getUser());
    this._super(...arguments);
  },

  settingStateOrNotLocked: or(
    'resource.is_not_locked',
    'settingState'
  ),
  
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
      let state_was = resource.get('aasm_state');
      resource.set('aasm_state', state);
      this.set('settingState', true);
      return resource
        .save()
        .then(() => {
          this.set('settingState', false);
        })
        .catch(() => {
          this.set('settingState', false);
          resource.set('aasm_state', state_was);
        });
    },
    /* 
     * publish()
     *
     * handle the action to change a model's aasm_state to 'published'
     */
    publish() {
      return this.send('setState', 'published');
    },
    /* 
     * unpublish()
     *
     * handle the action to change a model's aasm_state to 'locked'
     */
    unpublish() {
      return this.send('setState', 'locked');
    },
    /* 
     * cancel()
     *
     * handle the action to change a model's aasm_state to 'cancelled'
     */    
    cancel() {
      if (confirm('Are you sure?')) {
        return this.send('setState', 'cancelled');
      }
    },
  },
});

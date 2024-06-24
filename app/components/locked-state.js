import { computed } from '@ember/object';
import { or } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  tagName: '',
  classNames: ['locked-state'],
  
  settingStateOrPublished: or('resource.is_published', 'settingState'),

  actions: {
    /* 
     * setState()
     *
     * Make the request to change the aasm_state of a record
     * 
     * state      str     The state the change the aasm_state to
     */
    setState(state) {
      this.set('settingState', true);
      let resource = this.resource;
      let state_was = resource.get('aasm_state');
      resource.set('aasm_state', state);
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
     * lock()
     *
     * handle the action to change a model's aasm_state to 'locked'
     */
    lock() {
      return this.send('setState', 'locked');
    },
    /* 
     * unlock()
     *
     * handle the action to change a model's aasm_state to 'draft'
     */
    unlock() {
      return this.send('setState', 'draft');
    },
  },
});

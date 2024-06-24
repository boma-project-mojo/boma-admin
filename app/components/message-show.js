import { equal } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import ENV from '../config/environment';

export default Component.extend({
  store: service(),
  session: service(),
  messagesService: service('messages'),

  sending: false,
  is_editing: equal('message.isNew', true),
  isSending: false,
  isSaving: false,
  sendAt: null,

  actions: {
    /* 
     * sendMessage()
     *
     * Handle the action to send a message
     */
    sendMessage() {
      if (confirm('Are you sure?')) {
        this.set('isSending', true);
        this.messagesService.sendMessageAjax(this.message).then(() => {
          this.set('isSending', false);
          this.refreshModel();
        });
      } else {
        return false;
      }
    },
    /* 
     * deleteDraft()
     *
     * Delete a message which has yet to be sent
     */
    deleteDraft() {
      if (confirm('Are you sure?')) {
        this.message.deleteRecord();
        this.message.save();
      } else {
        return false;
      }
    },
    /* 
     * removeFromHistory()
     *
     * Remove a message which has been sent from the history (JSON blob)
     */
    removeFromHistory() {
      if (confirm('Are you sure?')) {
        this.message.set('pushed_state', 'removed');
        this.message.save().then(() => {
          this.refreshModel();
        });
      } else {
        return false;
      }
    },
    /* 
     * schedule()
     *
     * Open the dialogue to schedule a message to be sent in the future
     */
    schedule() {
      this.set('isScheduling', true);
    },
    /* 
     * cancel()
     *
     * Close the dialogue to schedule a message to be sent in the future
     */
    cancel() {
      this.set('isScheduling', false);
    },
    /* 
     * updateMessage()
     *
     * Handle the action to update the message and set the time to schedule
     */
    updateMessage() {
      this.set('isSaving', true);
      this.message.save().then(() => {
        this.set('isScheduling', false);
        this.set('isSaving', false);
      });
    },
    /* 
     * unschedule()
     *
     * Cancel a scheduled notification
     */
    unschedule() {
      this.set('isSaving', true);
      this.message.set('send_at', null);
      this.message.save().then(() => {
        this.set('isScheduling', false);
        this.set('isSaving', false);
      });
    },
  },
});

import Component from '@ember/component';
import ENV from '../config/environment';

export default Component.extend({
  messages: [],
  errors: [],
  actions: {
    /* 
     * forgotPassword()
     *
     * Handle the action to request a password reset email.  
     */
    forgotPassword() {
      this.set('isLoading', true);

      var self = this;
      var data = { email: this.email || '' };

      $.post(ENV.APP['options']['apiURL'] + '/users/forgotten-password', {
        user: data,
      }).then(
        function (data) {
          if (data['errors'] && data['errors'].length > 0) {
            self.set('isLoading', false);
            self.set('messages', []);
            self.set('errors', data['errors']);
          } else {
            self.set('messages', data['messages']);
            self.set('errors', []);
          }
        },
        function () {
          self.set('signUpFailed', true);
          self.set('isLoading', false);
          self.set('errors', [
            'There was a network problem, please try again.',
          ]);
        }.bind(this)
      );
    },
  },
});

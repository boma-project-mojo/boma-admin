import { inject as service } from '@ember/service';
import Component from '@ember/component';
import ENV from '../config/environment';

export default Component.extend({
  messages: [],
  errors: [],
  
  queryParams: ['token'],

  session: service(),
  router: service(),
  
  actions: {
    /* 
     * authenticate()
     *
     * Login
     * 
     * @email       str     Email address to use to authenticate
     * @password    str     Password to use to authenticate.
     */
    authenticate(email, password) {
      this.set('isLoading', true);
      this.set('errors', []);
      this.set('messages', []);
      this.session
        .authenticate('authenticator:devise', email, password)
        .then(() => {
          this.router.transitionTo('festivals');
        })
        .catch((reason) => {
          this.set('errors', reason.errors);
        });
    },
    /* 
     * resetPassword()
     *
     * Reset Password and login
     */    
    resetPassword() {
      this.set('isLoading', true);

      var self = this;
      var pw = this.password;
      var data = {
        token: this.token || '',
        password: pw || '',
        validatePassword: this.validatePassword || '',
      };

      $.post(ENV.APP['options']['apiURL'] + '/users/reset-password', {
        user: data,
      }).then(
        function (data) {
          if (data['errors'] && data['errors'].length > 0) {
            self.set('isLoading', false);
            self.set('messages', []);
            self.set('errors', data['errors']);
          } else {
            self.set('errors', []);
            self.set('messages', data['messages']);

            self.send('authenticate', data['email'], self.get('password'));

            self.set('password', '');
            self.set('validatePassword', '');
          }
        },
        function () {
          self.set('messages', []);
          self.set('errors', [
            'There was a network problem, please try again.',
          ]);
        }.bind(this)
      );
    },
  },
});

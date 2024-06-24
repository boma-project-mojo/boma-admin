import { inject as service } from '@ember/service';
import Component from '@ember/component';
import ENV from '../config/environment';

export default Component.extend({
  messages: [],
  errors: [],
  queryParams: ['token'],
  
  session: service(),
  router: service(),
  currentUserService: service('current-user'),
  
  actions: {
    /* 
     * authenticate()
     *
     * Handle the action to authenticate the user session
     *
     * @email       str     Email address to be used 
     * @password    str     Password string to authenticate
     */
    authenticate(email, password) {
      this.set('isLoading', true);
      this.set('errors', []);
      this.set('messages', []);
      this.session
        .authenticate('authenticator:devise', email, password)
        .then(()=>{
          this.setCurrentUser(this.currentUserService.setUser());
          this.router.transitionTo('application');
        })
        .catch((reason) => {
          this.set('errors', reason.errors);
        });
    },
    /* 
     * claimInvite()
     *
     * Handle the action to claim an invite
     */
    claimInvite: function () {
      var self = this;
      var pw = this.password;
      var data = {
        token: this.token || '',
        password: pw || '',
        validatePassword: this.validatePassword || '',
      };

      $.post(ENV.APP['options']['apiURL'] + '/users/claim-invite', {
        user: data,
      }).then(
        function (data) {
          if (data['errors'] && data['errors'].length > 0) {
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

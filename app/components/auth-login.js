import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  messages: [],
  errors: [],

  session: service(),
  router: service(),
  currentUserService: service('current-user'),

  actions: {
    /* 
     * authenticate()
     *
     * Handle the action to login
     */ 
    authenticate() {
      this.set('isLoading', true);
      let { identification, password } = this;
      this.set('errors', []);
      this.session
        .authenticate('authenticator:devise', identification, password)
        .then(() => {
          this.setCurrentUser(this.currentUserService.setUser());
        })
        .then(() => this.router.transitionTo('organisations'))
        .catch((reason) => {
          this.set('isLoading', false);
          this.set('errors', [
            'There was an error with your email or password',
          ]);
        });
    },
  },
});

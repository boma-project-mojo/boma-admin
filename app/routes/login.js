import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend({
  session: service(),
  router: service(),
  
  redirect: function (a, transition, c) {
    // if the session is authenticated or the target is 
    // reset-password or claim-invite
      // set the user session
    // else
      // transition to the login route
    if (
      this.get('session.isAuthenticated') === true ||
      transition.targetName == 'reset-password' ||
      transition.targetName == 'claim-account'
    ) {
      this.router.transitionTo('organisations');
    } else {
      this.router.transitionTo('login');
    }
  },
});

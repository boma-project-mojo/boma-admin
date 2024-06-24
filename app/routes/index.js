import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import ENV from '../config/environment';

export default Route.extend({
  routeAfterAuthentication: 'organisations',

  session: service(),

  currentUserService: service('current-user'),
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
      transition.targetName == 'claim-invite'
    ) {
      this.currentUserService.setUser();
      this.router.transitionTo('organisations');
    } else {
      this.router.transitionTo('login');
    }
  },
});

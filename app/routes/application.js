import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import ENV from '../config/environment';

export default Route.extend({
  router: service(),
  session: service(),
  moment: service(),
  currentUserService: service('current-user'),

  routeAfterAuthentication: 'organisations',
  
  async beforeModel() {
    this.moment.setTimeZone('Europe/London');
    this.moment.setLocale('en-gb');

    await this.session.setup();
  },
  
  redirect: function (a, transition, c) {
    // if the session is authenticated or the target is 
    // reset-password or claim-invite
      // set the user session
    // else
      // transition to the login route
    if (
      this.session.isAuthenticated === true ||
      transition.targetName == 'reset-password' ||
      transition.targetName == 'claim-invite'
    ) {
      this.currentUserService.setUser();

      if (transition.targetName == 'index') {
        let user = this.currentUserService.getUser();
        this.router.transitionTo('organisations');
      }
    } else {
      this.router.transitionTo('login');
    }
  },

  setupController(controller, model) {
    if (this.get('session.isAuthenticated') === true) {
      controller.set('current_user', this.currentUserService.setUser());
    }

    if (
      ENV.APP['options']['apiHost'] ===
      'https://boma-api-production.boma.community'
    ) {
      controller.set('environment', 'production');
    }
    if (
      ENV.APP['options']['apiHost'] ===
      'https://boma-api-staging.boma.community'
    ) {
      controller.set('environment', 'staging');
    }
    if (ENV.APP['options']['apiHost'] === 'http://localhost:3000') {
      controller.set('environment', 'development');
    }

    this._super(controller, model);
  },
  actions: {
    didTransition(){
      window.scrollTo(0,0);
    },

    /* 
     * loading()
     *
     * Handle the ember loading state and use it to start the loading
     * header animation.  
     * 
     * @transition    obj    the ember data transition object
     */
    async loading(transition) {
      let controller = this.controllerFor('application');
      // Start the loading spinner
      controller.set('isLoading', true);
      // When the transition promise completes then stop the loading spinner
      transition.promise.finally(function() {
        controller.set('isLoading', false);
      });
    }
  },
});

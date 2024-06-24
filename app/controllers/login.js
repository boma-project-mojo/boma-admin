import Controller, { inject as controller } from '@ember/controller';

export default Controller.extend({
  applicationController: controller('application'),
  actions: {
    /* 
     * setCurrentUser()
     *
     * Sets the current user on the application controller 
     * (Called from auth components on successful login/password reset/claim invite)
     */
    setCurrentUser(current_user) {
      this.applicationController.set('current_user', current_user);
    },
  },
});

import Controller, { inject as controller } from '@ember/controller';

export default Controller.extend({
  applicationController: controller('application'),
  actions:{
    setCurrentUser(current_user){
      this.applicationController.set('current_user', current_user);
    }
  }
});
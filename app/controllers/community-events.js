import { alias } from '@ember/object/computed';
import Controller, { inject as controller } from '@ember/controller';

export default Controller.extend({
  applicationController: controller('application'),
  current_user: alias('applicationController.current_user'),
});

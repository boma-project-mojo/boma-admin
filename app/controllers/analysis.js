import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Controller, { inject as controller } from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  applicationController: controller('application'),
  current_user: alias('applicationController.current_user'),
  queryParams: ['from', 'to'],
});

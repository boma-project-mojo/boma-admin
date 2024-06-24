import Ember from 'ember';
import { inject as service } from '@ember/service';
import DS from 'ember-data';
import ENV from '../config/environment';
import { computed } from '@ember/object';

export default DS.JSONAPIAdapter.extend({
  session: service(),
  flash: service('flash-messages'),
  host: ENV.APP['options']['apiHost'],
  namespace: ENV.APP['options']['apiNameSpace'],
  authorizer: 'authorizer:devise',

  session: service(),
  headers: computed(
    'session.data.authenticated.{token,user_email,user_token}',
    'session.isAuthenticated',
    function () {
      let headers = {};
      if (this.get('session.isAuthenticated')) {
        headers[
          'Authorization'
        ] = `Token user_token="${this.session.data.authenticated.user_token}", user_email="${this.session.data.authenticated.user_email}"`;
      }

      return headers;
    }
  ),

  handleResponse(status, headers, payload) {
    if (status === 500) {
      this.flash.alertError(
        'Network error, please check your internet connection.'
      );
    } else if (status === 401) {
      this.session.invalidate();
    } else {
      this.flash.clearFlash();
    }

    return this._super(status, headers, payload);
  },
});

import { inject as service } from '@ember/service';
import DS from 'ember-data';
import ENV from '../config/environment';
import { computed } from '@ember/object';

export default DS.JSONAPIAdapter.extend({
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

  pathForType: function (type) {
    let underscore = type.split('-').join('_');
    return `${underscore}s`;
  },

  // NEED TO DRY THIS UP WITH FESTIVAL ADAPTER
  handleResponse(status, headers, payload) {
    if (status === 500) {
      this.flash.alertError(
        'Network error, please check your internet connection.'
      );
    } else if (status === 401) {
      this.session.invalidate();
    } else if (this.isInvalid(...arguments)) {
      if (payload.errors[0].flash) {
        this.flash.alertError(payload.errors[0].flash);
      }
      // These errors should be handled inline
    } else {
      this.flash.clearFlash();
    }

    return this._super(status, headers, payload);
  },
});

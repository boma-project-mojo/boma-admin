/* 

This service handles the request to send push notifications.  

*/

import Service, { inject as service } from '@ember/service';
import ENV from '../config/environment';

export default Service.extend({
  session: service(),

  /* 
   * sendMessageAjax()
   *
   * Post the API request to trigger sending the message provided
   * 
   * @message     Ember Data Object     The ember data object for the message that should be sent.
   */  
  sendMessageAjax(message) {
    var self = this;
    let headers = {};

    if (this.get('session.isAuthenticated')) {
      headers[
        'Authorization'
      ] = `Token user_token="${this.session.data.authenticated.user_token}", user_email="${this.session.data.authenticated.user_email}"`;
    }

    return axios.post(
      ENV.APP['options']['apiURL'] + '/messages/send-message',
      {
        id: message.get('id'),
      },
      {
        headers
      }
    )
      .then(function (response) {
        if (response.data['errors'] && response.data['errors'].length > 0) {
          self.set('messages', []);
          alert(response.data['errors']);
        } else {
          if (response.data['success'] == true) {
            alert('sent!');
          } else {
            alert(response.data['error']);
          }
        }
      })
      .catch((response) => {
        alert(response);
      });
  },
});

/* 

This service manages the ember data store record for the User model for the
currently authenticated user.  

*/

import Service, { inject as service } from '@ember/service';

export default Service.extend({
  user: null,
  user_id: null,

  store: service(),
  session: service(),

  /* 
   * getUser()
   *
   * Get the ember data object of the user who is correctly signed in
   */
  getUser() {
    return this.store.peekRecord('user', this.user_id);
  },
  /* 
   * setUser()
   *
   * Set the user_id and return the ember data object of the user when 
   * a session is successfully authenticated.  
   */
  setUser() {
    if (this.get('session.isAuthenticated')) {
      let user_id = this.get('session.session.authenticated.user_id');
      this.store.pushPayload(
        this.get('session.session.authenticated.user_data')
      );
      this.set('user_id', user_id);
      let user = this.store.peekRecord('user', user_id);
      return user;
    }
  },
});

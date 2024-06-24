import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import ENV from "../config/environment";

export default Component.extend({
  store: service(),
  session: service(),

  is_editing_or_new: computed('is_editing', 'user.isNew', function(){
    return (this.get('user.isNew') === true || this.is_editing === true);
  }),

  init(){
    this._super(...arguments)
    if (this.get('user.roles') && this.get('user.roles').length > 0) {
      let selectedVenuePermissions = this.get('user.roles')
        .filter((role) => role.resource_type === 'AppData::Venue');

      this.set('selectedVenuePermissions', selectedVenuePermissions);
    }else{
      this.set('selectedVenuePermissions', []);
    }
  },

  actions:{
    /* 
     * sendInvite()
     * 
     * Handle the action to send an invite via email to a user
     */
    sendInvite(){
      let headers = {};
      headers['Authorization'] = `Token user_token="${this.session.data.authenticated.user_token}", user_email="${this.session.data.authenticated.user_email}"`;

      var self = this;
      axios.post(
        ENV.APP['options']['apiURL']+"/users/send-invite",
          {
            id: this.get('user.id'),
            festival_id: this.festival.id
          },
          { headers: headers }
        ).then(function(data) {
          alert("Invite Successfully Sent!")
          if(data['errors'] && data['errors'].length > 0){
            self.set("messages", []);
            self.set("errors", data["errors"]);
          }else{
            self.get('store').pushPayload(data);
          }
        }).catch((response)=>this.set('errors',response.errors));
    },
    /* 
     * delete()
     * 
     * Delete an existing user
     */
    delete(){
      if (confirm("Are you sure?")) {
        this.user.deleteRecord();
        this.user.save();
      } else {
        return false;
      }
    },
    /* 
     * edit()
     * 
     * Handle the action to edit a user
     */
    edit(){
      this.set('is_editing', true);
    },
    /* 
     * cancel()
     * 
     * Handle the action to cancel editing a user
     */
    cancel(){
      this.user.rollbackAttributes();
      this.set('is_editing', false);
    },
    /* 
     * discard()
     * 
     * Handle the action to discard an unsaved user
     */
    discard(){
      if (confirm("Are you sure?")) {
        this.user.deleteRecord();
        this.resetNewUser();
      } else {
        return false;
      }      
    },
   /* 
     * save()
     * 
     * Save a user and optionally reset the new user attributes
     */
    save(resetNewUser){
      var self = this;

      var user = this.user

      var userIsFestivalAdmin = this.get('user.is_festival_admin');

      var existingVenuePermissions;
      var venuePermissions;

      // If a user exists then just update the venue permissions.  
      // If it's a new user then create the new user.  
      this.store.query('user',{checking_user_status: true, email: this.get('user.email')}).then((response)=>{
        console.log(response)
        if(response.length === 0){
          console.log("user doesn't exist, creating.");
        }else{
          console.log("user exists, updating.");
          user = response[0];
          existingVenuePermissions = user.get('roles').map((r)=>r.resource_id).filter(Number);
        }

        user.save().then((user)=>{
          let headers = {};
          headers['Authorization'] = `Token user_token="${this.session.data.authenticated.user_token}", user_email="${this.session.data.authenticated.user_email}"`;

          headers['Accept'] = 'application/json';
          headers['Content-Type'] = 'application/json';

          var selectedVenuePermissions = this.selectedVenuePermissions.map((v)=>v.get('id'))

          if(existingVenuePermissions && existingVenuePermissions.length > 0){
            venuePermissions = existingVenuePermissions.concat(selectedVenuePermissions);
          }else{
            venuePermissions = selectedVenuePermissions
          }

          var data = {
            user_id: user.get('id'),
            venue_ids: venuePermissions,
            is_festival_admin: userIsFestivalAdmin,
            festival_id: this.get('festival.id'),
          }

          axios(
            {
              url: ENV.APP['options']['apiURL'] +
              '/festivals/' +
              this.get('festival.id') +
              '/set-roles/venues',
              method: 'POST',
              headers: headers,
              data
            }
          )
          .then(() => {
            user.set('password', '');
            if (resetNewUser) {
              self.resetNewUser();
              self.refreshModel();
            } else {
              self.set('is_editing', false);
              self.set('errors', null);
            }
          });
        }).catch((response)=>{
          console.log(response)
          self.set('errors',response.errors);
        });
      }).catch((response)=>{debugger})
    },
    saveNew(){
      this.send('save',true);
    },
  }
});

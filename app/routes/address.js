import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ENV from "../config/environment";
import { hash } from 'rsvp';

export default Route.extend({
	session: service(),  
	store: service(),

	queryParams: {
		address: {},
	},

	model(params){
		return new hash({
      data: this.doGetData(params)
    });
	},
  /* 
   * doGetData()
   *
   * Make the API request to return the latest data about this 
   * address
   * 
   * params       obj       the query params
   */
	doGetData(params){
    if(params.address){
      this.set('isLoading', true);

      let headers = {};
      if (this.get('session.isAuthenticated')) {
        headers['Authorization'] = `Token user_token="${this.session.data.authenticated.user_token}", user_email="${this.session.data.authenticated.user_email}"`;
      }

      return axios.get(
        ENV.APP['options']['apiURL']+"/addresses/"+params.address,
        {
          headers
        }
      ).then((response)=>{
        if(response.data['errors'] && response.data['errors'].length > 0){
          self.set("messages", []);
          self.set("errors", response.data["errors"]);
        }else{
          return response.data;
        }
      }).catch((response)=>this.set('errors',response.errors));
    }else{
      return false
    }
	},
  afterModel(){
    this.controllerFor('events').set('isLoading', false);
  },
	actions: {
    /* 
     * getData()
     *
     * Handle the action to get the address data 
     */
		getData(){
			window.location.reload(true);
		}
	}
});



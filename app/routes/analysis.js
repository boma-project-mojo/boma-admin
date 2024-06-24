import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ENV from '../config/environment';
import { hash } from 'rsvp';
import fetch from 'fetch';

export default Route.extend({
  session: service(),
  store: service(),
  moment: service(),

  queryParams: {
    from: {},
    to: {},
  },

  model(params) {
    this.set('festival_id', params.festival_id);

    return new hash({
      organisation: this.store.findRecord(
        'organisation',
        params.organisation_id
      ),
      festival: this.store.findRecord('festival', params.festival_id),
      data: this.doGetData(params),
    });
  },

  /* 
   * doGetData()
   *
   * Make the API request to return the analysis data
   * 
   * params       obj     the query params
   */
  doGetData(params) {
    this.set('isLoading', true);

    this.store
      .adapterFor('analysis')
      .set('namespace', 'admin_api/v1/festivals/' + this.festival_id);

    let headers = {};
    if (this.get('session.isAuthenticated')) {
      headers[
        'Authorization'
      ] = `Token user_token="${this.session.data.authenticated.user_token}", user_email="${this.session.data.authenticated.user_email}"`;
    }

    var data = {
      festival_id: this.get('festival.id'),
    };

    if (params.to && params.from) {
      data['to'] = this.moment.moment(params.to).unix();
      data['from'] = this.moment.moment(params.from).unix();
    }

    return fetch(
        ENV.APP['options']['apiURL'] +
          '/festivals/' +
          this.festival_id +
          '/activities/?' + new URLSearchParams(data),
        {
          method: 'GET',
          headers: headers,
        }
      )
      .then(function (response) {
        return response.json().then((data)=> {
          if (data['errors'] && data['errors'].length > 0) {
            self.set('messages', []);
            self.set('errors', data['errors']);
          } else {
            return data;
          } 
        })
      })
      .catch((response) => console.log(response));
  },

  afterModel() {
    this.controllerFor('events').set('isLoading', false);
  },

  actions: {
    /* 
     * getData()
     *
     * Handle the action to get the address data 
     */
    getData() {
      window.location.reload(true);
    },
  },
});

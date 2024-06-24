import Component from '@ember/component';
import { inject as service } from '@ember/service';
import ENV from '../config/environment';

export default Component.extend({
  session: service('session'),
  store: service('store'),
  attributeBindings: ['height', 'width'],
  loading: false,
  init() {
    this._super(...arguments);
    // Allows a per chart server request, populate the `dataMethod` attribute
    // in the handlebars template and this component will attempt to get the data
    // from the server on init
    if (this.dataMethod) {
      this.doGetData().then((data) => {
        this.set('data', data);
        this.initialiseChart(data);
        this.set('isLoading', false);
      });
    }
  },

  doGetData() {
    this.set('laoding', true);

    this.store
      .adapterFor('analysis')
      .set('namespace', 'admin_api/v1/festivals/' + this.festival.id);

    let headers = {};
    this.session.authorize('authorizer:devise', (headerName, headerValue) => {
      headers[headerName] = headerValue;
    });

    var data = {
      festival_id: this.get('festival.id'),
    };

    if (this.to && this.from) {
      data['to'] = moment(this.to).unix();
      data['from'] = moment(this.from).unix();
    }

    return fetch(
        ENV.APP['options']['apiURL'] +
          '/festivals/' +
          this.festival.id +
          '/activities/' +
          this.dataMethod,
        {
          method: 'GET',
          data: data,
          headers: headers,
        }
      )
      .then(function (data) {
        if (data['errors'] && data['errors'].length > 0) {
          self.set('messages', []);
          self.set('errors', data['errors']);
        } else {
          return data;
        }
      })
      .catch((response) => this.set('errors', response.errors));
  },
});

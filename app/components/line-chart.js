import Component from '@ember/component';
import { inject as service } from '@ember/service';
import ENV from '../config/environment';

export default Component.extend({
  tagName: 'canvas',

  session: service(),
  store: service(),

  attributeBindings: ['height', 'width'],
  
  showXAxis: true,
  chart: null,
  isLoading: false,
  
  init() {
    this._super(...arguments);
    //    * DEPRECATED, LEFT FOR POTENTIAL FUTURE USE * 
    // Allows a per chart server request, populate the `dataMethod` attribute
    // in the handlebars template and this component will attempt to get the data
    // from the server on init
    if (this.dataMethod) {
      this.doGetData().then((data) => {
        this.set('data', data);
        this.initialiseChart(data);
        this.set('isLoading', false);
      });
    } else {
      if (this.data) {
        this.initialiseChart(this.data);
        this.set('isLoading', true);
      }
    }
  },
  /* 
   * DEPRECATED, LEFT FOR POTENTIAL FUTURE USE
   *
   * doGetData()
   *
   * Make the request to get the data 
   */
  doGetData() {
    this.set('isLoading', true);

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
  /* 
   * initialiseChart()
   *
   * Init a chart.js line chart
   * 
   * @data      object      The data to be displayed
   */
  initialiseChart(data) {
    var self = this;

    setTimeout(() => {
      var ctx = this.element.getContext('2d');

      // Handle Loading and no data states.  
      Chart.register({
        id: 'linechart',
        afterDraw: function (chart) {
          if (chart.data.datasets.length === 0) {
            // No data is present
            var ctx = chart.chart.ctx;
            var width = chart.chart.width;
            var height = chart.chart.height;
            chart.clear();

            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = "16px normal 'Helvetica Nueue'";

            if (self.get('isLoading') === true) {
              ctx.fillText('Loading', width / 2, height / 2);
            } else {
              ctx.fillText('No data to display', width / 2, height / 2);
            }
            ctx.restore();
          }
        },
      });

      var axis_config;

      if (data) {
        axis_config = data.axis_config;
      } else {
        axis_config = {};
      }

      var chart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
          legend: {
            id: 'chart-key',
            position: 'left',
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  fontSize: 10,
                },
                gridLines: {
                  color: 'rgb(255, 255, 255, 0.05)',
                },
              },
            ],
            xAxes: [
              {
                type: 'time',
                gridLines: {
                  color: 'rgb(255, 255, 255, 0.05)',
                },
                ticks: {
                  fontSize: 10,
                },
                time: axis_config,
              },
            ],
          },
        },
      });

      this.chart = chart;
    }, 100);
  },
});

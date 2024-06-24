import Component from '@ember/component';

export default Component.extend({
  showXAxis: true,
  chart: null,
  initialiseChart() {
    var ctx = $(this.element).find('canvas')[0].getContext('2d');

    var data = this.data;

    Chart.register({
      id: 'piechart',
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
          ctx.fillText('No data to display', width / 2, height / 2);
          ctx.restore();
        }
      },
    });

    var chart = new Chart(ctx, {
      type: 'pie',
      data: data,
      options: {
        plugins: {
          legend: {
            id: 'chart-key',
            position: 'left',
          },
        },
        responsive: false,
      },
    });

    this.chart = chart;
  },
  didInsertElement() {
    this._super(...arguments);
    this.initialiseChart();
  },
  didUpdateAttrs() {
    this._super();
    this.chart.destroy();
    this.initialiseChart();
  },
});

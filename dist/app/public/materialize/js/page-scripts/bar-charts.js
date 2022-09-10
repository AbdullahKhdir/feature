(function ($) {
  $(document).ready(function(){

    var barChart = $('#percentage-bar-chart');
    if (barChart.length) {
      var percbarTooltip = Object.assign({}, tooltipsOpts);
      percbarTooltip.mode = 'nearest';
      percbarTooltip.intersect = true;
      percbarTooltip.callbacks = { footer: percentageStackedFooterCallback };

      var percBarChart = new Chart(barChart, {
        type: 'horizontalBar',
        data: {
          datasets: [{
              label: 'dataset 1',
              data: [23],
              backgroundColor: chartColorBlue,
          },{
              label: 'dataset 2',
              data: [10],
              backgroundColor: chartColorYellow,
          },{
              label: 'dataset 3',
              data: [5],
              backgroundColor: chartColorPink,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          tooltips: percbarTooltip,
          legend: {
            display: false
          },
          scales: {
            display: false,
            xAxes: [{
              beforeDataLimits: function(axis) {
                var datasets = axis.chart.data.datasets;
                if (datasets.length) {
                  var len = datasets[0].data.length;
                  var max = 0;

                  for (var i = 0; i < len; i++) {
                    var sum = 0;
                    datasets.forEach(function(dataset) {
                      sum += dataset.data[i];
                    });

                    if (sum > max) {
                      max = sum;
                    }
                  }
                }
                axis.options.ticks.max = max;
                axis.options.ticks.min = 0;
              },
              display: false,
              stacked: true,
            }],
            yAxes: [{
              barPercentage: 1,
              categoryPercentage: 1,
              maxBarThickness: 100,
              display: false,
              stacked: true,
            }]
          },
        }
      });
    }



  });
}( jQuery ));

(function ($) {
  $(document).ready(function(){

    var fixedLineChart = $('#fixed-line-chart');
    var fixedLineChartJS = new Chart(fixedLineChart, {
      type: 'line',
      data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
          label: 'Revenue',
          data: [7, 9, 10, 13, 7, 10],
          borderColor: chartColorYellow,
          backgroundColor: rgbToRgba(chartColorYellow, '.25'),
          pointBackgroundColor: chartColorYellow,
          pointBorderColor: rgbToRgba(chartColorYellow, '.25'),
          lineTension: 0,
          fill: 'origin',
        },{
          label: 'Clicks',
          data: [5, 12, 18, 9, 11, 14],
          borderColor: chartColorPink,
          backgroundColor: rgbToRgba(chartColorPink, '.25'),
          pointBackgroundColor: chartColorPink,
          pointBorderColor: rgbToRgba(chartColorPink, '.25'),
          lineTension: 0,
          fill: 'origin',
        },{
          label: 'Users',
          data: [12, 19, 3, 5, 2, 3],
          borderColor: chartColorBlue,
          backgroundColor: rgbToRgba(chartColorBlue, '.25'),
          pointBackgroundColor: chartColorBlue,
          pointBorderColor: rgbToRgba(chartColorBlue, '.25'),
          lineTension: 0,
          fill: 'origin'
        }]
      },
      options: {
        hover: {
          mode: 'index',
          intersect: false
        },
        maintainAspectRatio: false,
      }
    });

  });
}( jQuery ));

(function ($) {
  $(document).ready(function(){

    var doughnutTooltip = Object.assign({}, tooltipsOpts);
    doughnutTooltip.intersect = true;
    delete doughnutTooltip.mode;

    // Doughnut chart
    var doughnutChart = $('#doughnut-chart');
    var doughnutChartJS = new Chart(doughnutChart, {
      type: 'doughnut',
      data: {
        labels: ["Pink", "Blue", "Yellow", "Green"],
        datasets: [{
          label: 'dataset 1',
          data: [12, 19, 3, 5],
          backgroundColor: [chartColorPink, chartColorBlue, chartColorYellow, chartColorGreen],
          borderWidth: 0
        }],
      },
      options: {
        tooltips: doughnutTooltip,
        legendCallback: doughnutLegendCallback,
        cutoutPercentage: 80
      }
    });
    doughnutChart.closest('.card-content').find('.chart-legend-wrapper').append($(doughnutChartJS.generateLegend()));


    // Percentage Doughnut chart
    var percDoughnutChart = $('#perc-doughnut-chart');
    var percDoughnutChartJS = new Chart(percDoughnutChart, {
      type: 'doughnut',
      data: {
        labels: ["Pink", "Blue"],
        datasets: [{
          label: 'dataset 1',
          data: [73, 44],
          backgroundColor: [chartColorPink, chartColorBlue],
          borderWidth: 0
        }],
      },
      options: {
        tooltips: doughnutTooltip,
        legendCallback: percDoughnutLegendCallback,
        cutoutPercentage: 80
      }
    });
    percDoughnutChart.before(percDoughnutChartJS.generateLegend());


  });
}( jQuery ));

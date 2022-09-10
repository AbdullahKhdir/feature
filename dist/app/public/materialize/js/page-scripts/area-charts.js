(function ($) {
  $(document).ready(function(){

    // Radar Chart
    var data = {
      labels: ['Strength', 'Dexterity', 'Intelligence', 'Charisma', 'Stamina', 'Wisdom'],
      datasets: [{
        backgroundColor: rgbToRgba(chartColorBlue, ".5"),
        pointBackgroundColor: chartColorBlue,
        data: [12, 10, 1, 5, 8, 3],
        label: 'Blue'
      }, {
        backgroundColor: rgbToRgba(chartColorPink, ".5"),
        pointBackgroundColor: chartColorPink,
        data: [6, 14, 6, 9, 10, 10],
        label: 'Pink',
      }, {
        backgroundColor: rgbToRgba(chartColorYellow, ".5"),
        pointBackgroundColor: chartColorYellow,
        data: [4, 3, 16, 10, 5, 9],
        label: 'Yellow',
      }]
    };

    var $radarChart = $('#radar-chart');
    var radarChart = new Chart($radarChart, {
      type: 'radar',
      data: data,
      options: {
        maintainAspectRatio: false,
        responsive: true
      }
    });

  });
}( jQuery ));

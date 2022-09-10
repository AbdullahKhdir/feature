(function ($) {
  $(document).ready(function(){

    var cardLegendChipCallback = function(chart) {
      var $legend = $('<div class="chips-wrapper"></div>');
      for (var i=0; i<chart.data.datasets.length; i++) {
        var dataset = chart.data.datasets[i];
        var $chip = $('<div data-index="' + i +'"class="chip white-text">' + dataset.label + '<i class="close material-icons">close</i></div>');
        if (dataset.borderColor) {
          $chip.css({backgroundColor: dataset.borderColor });
        }
        $chip.find('.close').on('click', function() {
          var card = $(this).closest('.card');
          var cardChart = card.find($('.card-chart'));

          if (cardChart.length) {
            var chart = chartExists(cardChart);

            if (!!chart) {
              var index = $(this).closest('.chip').attr('data-index');
              chart.data.datasets[index].hidden = true;
              chart.update();
            }
          }
        });
        $legend.append($chip);
      }
      return $legend;
    };
    var cardLegendChipLine = $("#card-legend-chip-line-chart");
    var cardLegendChipLineChart = new Chart(cardLegendChipLine, {
      type: 'line',
      data: {
        labels: ["One", "Two", "Three", "Four", "Five", "Six"],
        datasets: [{
          label: 'Red',
          data: [12, 19, 3, 5, 2, 3],
          borderColor: chartColorPink,
          pointBackgroundColor: chartColorPink,
          pointBorderColor: rgbToRgba(chartColorPink, ".2"),
          lineTension: 0,
          pointStyle: 'circle',
          fill: false
        },{
          label: 'Blue',
          data: [5, 12, 18, 9, 11, 14],
          borderColor: chartColorBlue,
          pointBackgroundColor: chartColorBlue,
          pointBorderColor: rgbToRgba(chartColorBlue, ".2"),
          lineTension: 0,
          pointStyle: 'circle',
          fill: false,
        },{
          label: 'Yellow',
          data: [9, 10, 14, 11, 6, 9],
          borderColor: chartColorYellow,
          pointBackgroundColor: chartColorYellow,
          pointBorderColor: rgbToRgba(chartColorYellow, ".2"),
          lineTension: 0,
          pointStyle: 'circle',
          fill: false,
        }]
      },
      options: {
        hover: {
          mode: 'index',
          intersect: false
        },
        legendCallback: cardLegendChipCallback
      }
    })
    cardLegendChipLine.closest('.card').find('.card-toolbar-actions').append($(cardLegendChipLineChart.generateLegend()));


    var selectLegendCallback = function(chart) {
      var $select = $('<select></select>');
      for (var i=0; i<chart.data.datasets.length; i++) {
        var dataset = chart.data.datasets[i];
        var $option = $('<option value="' + dataset.label + '">' + dataset.label + '</option>');
        $select.append($option);
      }
      return $select;
    };
    $(document).on('change', '.card-toolbar-actions select', function() {
      var card = $(this).closest('.card');
      var cardChart = card.find($('.card-chart'));

      if (cardChart.length) {
        var chart = chartExists(cardChart);

        if (!!chart) {
          var label = this.value;

          for (var i = 0; i < chart.data.datasets.length; i++) {
            var dataset = chart.data.datasets[i];
            var isHidden = true;
            if (dataset.label === label) {
              isHidden = false;
            }
            dataset.hidden = isHidden;
          }

          chart.update();
        }
      }
    });


    var selectLegendLine = $("#select-legend-line-chart");
    var selectLegendLineChart = new Chart(selectLegendLine, {
      type: 'line',
      data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
          label: 'Day',
          data: [12, 19, 3, 5, 2, 3],
          borderColor: 'rgb(244,67,54)',
          pointBackgroundColor: 'rgb(244,67,54)',
          pointBorderColor: 'rgba(244,67,54,.1)',
          lineTension: 0,
          pointStyle: 'circle',
          fill: false
        },{
          label: 'Month',
          data: [5, 12, 18, 9, 11, 14],
          borderColor: 'rgb(33,150,243)',
          pointBackgroundColor: 'rgb(33,150,243)',
          pointBorderColor: 'rgba(33,150,243,.1)',
          lineTension: 0,
          pointStyle: 'circle',
          fill: false,
          hidden: true
        },{
          label: 'Year',
          data: [40, 36, 24, 19, 30, 23],
          borderColor: 'rgb(255,235,59)',
          pointBackgroundColor: 'rgb(255,235,59)',
          pointBorderColor: 'rgba(255,235,59,.1)',
          lineTension: 0,
          pointStyle: 'circle',
          fill: false,
          hidden: true
        }]
      },
      options: {
        hover: {
          mode: 'index',
          intersect: false
        },
        legendCallback: selectLegendCallback
      }
    })
    selectLegendLine.closest('.card').find('.card-toolbar-actions').append($(selectLegendLineChart.generateLegend()));

  });
}( jQuery ));

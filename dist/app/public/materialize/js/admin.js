/*!
 * Admin v1.0.2
 * Materialize theme
 * http://materializecss.com/themes.html
 * Personal Use License
 * by Alan Chang
 */

/********************
 * Helper Functions *
 ********************/
var debounce = function (fn, duration) {
  var timeout;
  return function () {
    var args = Array.prototype.slice.call(arguments),
        ctx = this;

    clearTimeout(timeout);
    timeout = setTimeout(function () {
      fn.apply(ctx, args);
    }, duration);
  };
};

var chartExists = function(cardChart) {
  var exists = false;
  for (var i in Chart.instances) {
    chart = Chart.instances[i];
    if (cardChart.is(chart.canvas)) {
      exists = true;
      break;
    }
  }

  if (exists) {
    return chart;
  } else {
    return false;
  }
}

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomBarNoTime(lastClose) {
  var open = randomNumber(lastClose * .95, lastClose * 1.05);
  var close = randomNumber(open * .95, open * 1.05);
  var high = randomNumber(Math.max(open, close), Math.max(open, close) * 1.1);
  var low = randomNumber(Math.min(open, close) * .9, Math.min(open, close));
  return {
    o: open,
    h: high,
    l: low,
    c: close,
  };
}

function randomBar(date, lastClose) {
  var bar = getRandomBarNoTime(lastClose);
  bar.t = date.valueOf();
  return bar;
}

function getRandomData(date, count) {
  var dateFormat = 'MMMM DD YYYY';
  var date = moment(date, dateFormat);
  var data = [randomBar(date, 30)];
  while (data.length < count) {
    date = date.clone().add(1, 'd');
    if (date.isoWeekday() <= 5) {
      data.push(randomBar(date, data[data.length - 1].c));
    }
  }
  return data;
}

/* End Helper Functions */


/****************
 * Chart Colors *
 ****************/
var chartColorYellow = "rgb(255,196,0)";
var chartColorBlue = "rgb(0,176,255)";
var chartColorPink = "rgb(255,64,129)";
var chartColorGreen = "rgb(112,190,116)";

function rgbToRgba(rgb, alpha) {
  return rgb.replace(')', ', ' + alpha + ')').replace('rgb', 'rgba');
}
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(rgb) {
  var digits = /(.*?)rgb\((\d+),(\d+),(\d+)\)/.exec(rgb);
  var r = parseInt(digits[2]);
  var g = parseInt(digits[3]);
  var b = parseInt(digits[4]);
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

/* End Chart Colors */


/*************************
 * Chart Common Settings *
 *************************/
var tooltipsOpts = {
  enabled: false,
  mode: 'index',
  intersect: false,
  backgroundColor: '#fff',
  cornerRadius: 2,
  caretSize: 0,
  xPadding: 12,
  yPadding: 12,
  custom: function(tooltipModel) {
    // Tooltip Element
    var tooltipEl = document.getElementById('chartjs-tooltip');

    // Create element on first render
    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.id = 'chartjs-tooltip';
      tooltipEl.innerHTML = "<table></table>"
      document.body.appendChild(tooltipEl);
    }

    // Hide if no tooltip
    if (tooltipModel.opacity === 0) {
      tooltipEl.style.opacity = 0;
      return;
    }

    // Set caret Position
    tooltipEl.classList.remove('above', 'below', 'no-transform');
    if (tooltipModel.yAlign) {
      tooltipEl.classList.add(tooltipModel.yAlign);
    } else {
      tooltipEl.classList.add('no-transform');
    }

    function getBody(bodyItem) {
      return bodyItem.lines;
    }

    // Set Text
    if (tooltipModel.body) {
      var titleLines = tooltipModel.title || [];
      var bodyLines = tooltipModel.body.map(getBody);
      var footerLines = tooltipModel.footer;
      var innerHtml = '<thead>';

      titleLines.forEach(function(title) {
        innerHtml += '<tr><th>' + title + '</th></tr>';
      });
      innerHtml += '</thead><tbody>';

      bodyLines.forEach(function(body, i) {
        var colors = tooltipModel.labelColors[i];
        var span = '';

        // Add color key if more than 1 dataset
        if (bodyLines.length > 1) {
          var style =
          span = '<span class="chartjs-tooltip-key" style="background:' + colors.backgroundColor + ';"></span>';
        }

        innerHtml += '<tr><td>' + span + body + '</td></tr>';
      });

      if (footerLines.length) {
        innerHtml += '<tfoot>';
        footerLines.forEach(function(footer, i) {
          innerHtml += '<tr><td>' + footer + '</td></tr>'
        });
        innerHtml += '</tfoot>';
      }

      innerHtml += '</tbody>';

      var tableRoot = tooltipEl.querySelector('table');
      tableRoot.innerHTML = innerHtml;
    }

    // `this` will be the overall tooltip
    var position = this._chart.canvas.getBoundingClientRect();


    // Display, position, and set styles for font
    tooltipEl.style.opacity = 1;
    tooltipEl.style.left = $(window).scrollLeft() + position.left + tooltipModel.caretX + 20 + 'px';
    tooltipEl.style.top = $(window).scrollTop() + position.top + tooltipModel.caretY + 'px';
    tooltipEl.style.fontSize = tooltipModel.fontSize;
    tooltipEl.style.fontStyle = tooltipModel._fontStyle;
    tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
  }

};

// Area Options
var areaOptions = {
  maintainAspectRatio: false,
  spanGaps: false,
  elements: {
    line: {
      tension: 0.4
    }
  },
  scales: {
    yAxes: [{
      stacked: true
    }]
  },
  plugins: {
    filler: {
      propagate: false
    }
  }
};

var flushChartOptions = Object.assign({}, areaOptions);
flushChartOptions.hover = {
  hover: {
    mode: 'index',
    intersect: false
  }
};
flushChartOptions.legend = { display: false };
flushChartOptions.scales = {
  xAxes: [{
    display: false
  }],
  yAxes: [{
    display: false,
    stacked: true
  }]
};

/* End Chart Common Settings */


/*******************
 * Chart Callbacks *
 *******************/

// Tooltip Callbacks
var percentageFooterCallback = function(tooltipItems, data) {
  var label = "";
  var sum = 0;
  var val = 0;
  tooltipItems.forEach(function(tooltipItem) {
    val = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
    data.datasets[tooltipItem.datasetIndex].data.forEach(function(datasetVal) {
      sum += datasetVal;
    });
  });

  var perc = ((val / sum) * 100).toFixed(1);
  return perc + '%';
}

var percentageStackedFooterCallback = function(tooltipItems, data) {
  var label = "";
  var sum = 0;
  var val = 0;
  tooltipItems.forEach(function(tooltipItem) {
    val = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
    data.datasets.forEach(function(dataset) {
      sum += dataset.data[tooltipItem.index];
    });
  });

  var perc = ((val / sum) * 100).toFixed(1);
  return perc + '%';
}

// Doughnut callbacks
var doughnutLegendCallback = function(chart) {
  var $legend = $('<div class="chart-legend"></div>');
  var $ul = $('<ul></ul>');
  var labels = chart.data.labels;
  if (chart.data.datasets.length) {
    for (var i=0; i<chart.data.datasets[0].data.length; i++) {
      var val = chart.data.datasets[0].data[i];
      var color = chart.data.datasets[0].backgroundColor[i];
      var $li = $('<li><span style="background-color: ' + color + '" class="dot"></span><span class="label">' + labels[i] + '</span><span class="value">' + val + '</span></li>');
      $ul.append($li);
    }
  }

  $legend.append($ul);
  return $legend;
};

var percDoughnutLegendCallback = function(chart) {
  $legend = $('<div class="perc-doughnut-legend"></div>');
  if (chart.data.datasets.length) {
    var total = 0;
    var maxPerc = 0;
    var maxColor = "#000000";
    for (var i=0; i<chart.data.datasets[0].data.length; i++) {
      var val = chart.data.datasets[0].data[i];
      var color = chart.data.datasets[0].backgroundColor[i];
      if (val > maxPerc) {
        maxPerc = val;
        maxColor = color;
      }
      total += val;
    }
    $legend.text((maxPerc / total * 100).toFixed(1) + '%');
    $legend.css('color', maxColor);
  }
  return $legend;
};

// Legend callbacks
var cardLegendCallback = function(chart) {
  var $legend = $('<div class="card-metrics"></div>');
  for (var i=0; i<chart.data.datasets.length; i++) {
    var dataset = chart.data.datasets[i];
    var $metric = $('<div class="card-metric colored waves-effect waves-light active"></div>');
    if (dataset.borderColor) {
      $metric.css({backgroundColor: dataset.borderColor });
    }
    var $title = $('<div class="card-metric-title">' + dataset.label + '</div>');
    var sum = dataset.data.reduce(function(total, num) {
      return total + num;
    });
    var $value = $('<div class="card-metric-value">' + sum + '</div>');
    $metric.append($title);
    $metric.append($value);
    $legend.append($metric);
  }
  return $legend;
};

var tabLegendCallback = function(chart) {
  var $legend = $('<div class="card-tabs"></div>');
  var $tabs = $('<ul class="tabs tabs-fixed-width tabs-transparent"></ul>');
  for (var i=0; i<chart.data.datasets.length; i++) {
    var dataset = chart.data.datasets[i];
    var $tab = $('<li class="tab"></li>');
    var $title = $('<a href="#">' + dataset.label + '</a>');
    $tab.append($title);
    $tabs.append($tab);
  }
  $legend.append($tabs);
  return $legend;
};

/* End Chart Callbacks */


(function ($) {
  $(document).ready(function(){


    /********************
     * Materialize Init *
     ********************/

    $('.card-toolbar-actions .dropdown-trigger').dropdown({
      constrainWidth: false,
    });

    /* End Materialize Init */


    /****************
     * Masonry Init *
     ****************/

    var $masonry = $('.masonry')
    $masonry.masonry({
      itemSelector: '.masonry > .col',
      columnWidth: '.m6'
    });

    /* End Masonry Init */


    /********************
     *     Chart JS     *
     ********************/

    // Global defaults
    Chart.scaleService.updateScaleDefaults('linear', {
      position: 'right'
    });

    Chart.scaleService.updateScaleDefaults('category', {
      gridLines: {
        display: false
      }
    });
    Chart.defaults.scale.gridLines.color = 'rgba(0,0,0,.08)';
    Chart.defaults.scale.gridLines.zeroLineColor = 'rgba(0,0,0,.08)';

    // Chart.defaults.bar.categoryPercentage = 1;
    Chart.defaults.bar.scales.xAxes[0].barPercentage = .85;
    Chart.defaults.bar.scales.xAxes[0].categoryPercentage = 1;
    Chart.defaults.global.legend.display = false;

    // Candlestick styles
    Chart.defaults.candlestick.scales.xAxes[0].gridLines = {display: false};
    // Chart.defaults.candlestick.scales.yAxes[0].gridLines = {display: false};

    // Point styles
    Chart.defaults.global.elements.point.radius = 0;
    Chart.defaults.global.elements.point.borderWidth = 20;
    Chart.defaults.global.elements.point.hoverRadius = 5;
    Chart.defaults.global.elements.point.backgroundColor = 'rgb(0,0,0)';
    Chart.defaults.global.elements.point.borderColor = 'rgba(0,0,0,.1)';

    // Line styles
    Chart.defaults.global.elements.line.borderColor = 'rgb(0,0,0)';

    // Area styles
    Chart.defaults.radar.elements.point = {
      hitRadius: 10,
      radius: 0,
      borderWidth: .0001,
      hoverRadius: 4,
      hoverBorderWidth: .0001,
    }
    Chart.defaults.radar.elements.line.tension = .15;
    Chart.defaults.radar.elements.line.borderWidth = 0.0001;
    Chart.defaults.radar.scale.ticks = {
      fontSize: 11
    }
    Chart.defaults.radar.scale.pointLabels = {
      fontSize: 12
    }
    Chart.scaleService.updateScaleDefaults('radialLinear', {
      gridLines: {
        color: 'rgba(0,0,0,.04)'
      }
    });

    Chart.defaults.global.tooltips = Object.assign(Chart.defaults.global.tooltips, tooltipsOpts);

    // Set default animations
    Chart.defaults.global.animation = Object.assign(Chart.defaults.global.animation, {
      duration: 700,
      easing: 'easeInOutQuint',
      onComplete: function() {
        $masonry.masonry('layout');
      }
    });


    /*******************
     *     ChartJS     *
     *******************/

    // Line chart
    var ctx = $("#line-chart");
    var myLineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          lineTension: 0,
          fill: 0
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

    // Main Toggle Line Chart
    var toggleData = {
      revenue: {
        label: 'Revenue',
        data: [1200, 940, 1340, 1440, 420, 1100, 670]
      },
      users: {
        label: 'Users',
        data: [1252, 872, 543, 1902, 1334, 998, 1640]
      },
      ctr: {
        label: 'CTR',
        data: [.18, .24, .33, .12, .23, .2, .23]
      }
    }

    var ctx = $("#main-toggle-line-chart");
    var myLineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        datasets: [{
          label: toggleData['revenue'].label,
          data: toggleData['revenue'].data,
          lineTension: 0,
          fill: 0
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

    $("#main-toggle-line-chart")
      .closest('.card').find('.card-metrics')
      .on('click', '.card-metric', function(e) {
        e.stopPropagation();
        var card = $(this).closest('.card');
        var cardChart = card.find($('.card-chart'));

        if (cardChart.length) {
          var chart = chartExists(cardChart);
          var metric = $(this).attr('data-metric');

          if (!!chart && toggleData.hasOwnProperty(metric)) {
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
            var index = $(this).index();
            var isActive = $(this).hasClass('active');

            chart.data.datasets[0].data = toggleData[metric].data;
            chart.data.datasets[0].label = toggleData[metric].label;
            chart.update();
          }
        }
    });


    var compareLine = $("#compare-line-chart");
    var compareLineChart = new Chart(compareLine, {
      type: 'line',
      data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          borderColor: 'rgb(244,67,54)',
          pointBackgroundColor: 'rgb(244,67,54)',
          pointBorderColor: 'rgba(244,67,54,.1)',
          lineTension: 0,
          fill: false
        },{
          label: '# of Votes',
          data: [5, 12, 18, 9, 11, 14],
          borderColor: 'rgb(33,150,243)',
          pointBackgroundColor: 'rgb(33,150,243)',
          pointBorderColor: 'rgba(33,150,243,.1)',
          lineTension: 0,
          fill: false,
          hidden: true
        }]
      },
      options: {
        hover: {
          mode: 'index',
          intersect: false
        },
      }
    });


    // Card metric chart toggle
    $(document).on('click', '.card-metric', function() {
      var card = $(this).closest('.card');
      var cardChart = card.find($('.card-chart'));

      if (cardChart.length) {
        var chart = chartExists(cardChart);

        if (!!chart) {
          $(this).toggleClass('active');
          var index = $(this).index();
          var isActive = $(this).hasClass('active');

          chart.data.datasets[index].hidden = !isActive;
          chart.update();
        }
      }
    });

    // Generic card metric interactivity
    $(document).on('click', '.tab', function() {
      var card = $(this).closest('.card');
      var cardChart = card.find($('.card-chart'));

      if (cardChart.length) {
        var chart = chartExists(cardChart);

        if (!!chart) {
          var index = $(this).index();

          for (var i = 0; i < chart.data.datasets.length; i++) {
            var isHidden = true;
            if (i === index) {
              isHidden = false;
            }
            chart.data.datasets[i].hidden = isHidden;
          }

          chart.update();
        }
      }
    });


    var tabLegendLine = $("#tab-legend-line-chart");
    var tabLegendLineChart = new Chart(tabLegendLine, {
      type: 'line',
      data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
          label: 'Day',
          data: [12, 19, 3, 5, 2, 3],
          borderColor: '#ffffff',
          pointBackgroundColor: '#ffffff',
          pointBorderColor: 'rgba(255,255,255,.2)',
          lineTension: 0,
          pointStyle: 'circle',
          fill: false
        },{
          label: 'Month',
          data: [5, 12, 18, 9, 11, 14],
          borderColor: '#ffffff',
          pointBackgroundColor: '#ffffff',
          pointBorderColor: 'rgba(255,255,255,.2)',
          lineTension: 0,
          pointStyle: 'circle',
          fill: false,
          hidden: true
        },{
          label: 'Year',
          data: [40, 36, 24, 19, 30, 23],
          borderColor: '#ffffff',
          pointBackgroundColor: '#ffffff',
          pointBorderColor: 'rgba(255,255,255,.2)',
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
        scales: {
          xAxes: [{
            gridLines: {
              color: 'rgba(255,255,255,.1)'
            },
            ticks: {
              fontColor: '#ffffff'
            },
          }],
          yAxes: [{
            gridLines: {
              color: 'rgba(255,255,255,.1)'
            },
            ticks: {
              fontColor: '#ffffff'
            }
          }]
        },
        legendCallback: tabLegendCallback
      }
    })
    tabLegendLine.closest('.card-content').before($(tabLegendLineChart.generateLegend()));


    var miniLine = $('#mini-line-chart');
    var myMiniLineChart = new Chart(miniLine, {
      type: 'line',
      data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
            label: '',
            data: [12, 19, 3, 5, 2, 3],
            borderColor: chartColorGreen,
            borderWidth: 2,
            pointBackgroundColor: 'inherit',
            lineTension: 0,
            pointRadius: 0,
            pointHoverRadius: 3,
            fill: 0
        }]
      },
      options: flushChartOptions
    });


    var miniLine = $('#mini-flush-line-chart');
    var miniLineChart = new Chart(miniLine, {
      type: 'line',
      data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
            label: '',
            data: [12, 19, 3, 5, 2, 3],
            borderColor: chartColorYellow,
            pointBackgroundColor: chartColorYellow,
            pointBorderColor: rgbToRgba(chartColorYellow, ".2"),
            lineTension: 0,
            fill: 0
        }]
      },
      options: {
        hover: {
          mode: 'index',
          intersect: false
        },
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: false
          }],
          yAxes: [{
            display: false
          }]
        },
        maintainAspectRatio: false,
      }
    });


    // Bar chart
    var barChart = $('#stacked-bar-chart');
    if (barChart.length) {
      var stackedBarChart = new Chart(barChart, {
        type: 'bar',
        data: {
          labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
          datasets: [{
              label: 'dataset 1',
              data: [12, 19, 3, 5, 2, 3],
              backgroundColor: chartColorBlue,
              borderColor: chartColorBlue,
          },{
              label: 'dataset 2',
              data: [4, 2, 1, 2, 4, 6],
              backgroundColor: chartColorYellow,
              borderColor: chartColorYellow,
          },{
              label: 'dataset 3',
              data: [5, 10, 8, 7, 4, 9],
              backgroundColor: chartColorPink,
              borderColor: chartColorPink,
          }]
        },
        options: {
          hover: {
            mode: 'index',
            intersect: false
          },
          scales: {
            xAxes: [{
              stacked: true,
              gridLines: {
                display:false
              }
            }],
            yAxes: [{
              position: 'right',
              stacked: true,
              gridLines: {
                color: 'rgba(0,0,0,0.08)'
              }
            }]
          },
        }
      });
    }

    var flushStackedChartOptions = Object.assign({}, flushChartOptions);
    flushStackedChartOptions.scales.xAxes = [{
      display: false,
      stacked: true
    }];
    var miniBar = $('#mini-stacked-bar-chart');
    var miniStackedBarChart = new Chart(miniBar, {
      type: 'bar',
      data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
            label: 'Blue',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: chartColorBlue,
            borderColor: chartColorBlue,
        },{
            label: 'Yellow',
            data: [4, 2, 1, 2, 4, 6],
            backgroundColor: chartColorYellow,
            borderColor: chartColorYellow,
        },{
            label: 'Pink',
            data: [5, 10, 8, 7, 4, 9],
            backgroundColor: chartColorPink,
            borderColor: chartColorPink,
        }]
      },
      options: flushStackedChartOptions
    });

    var miniBar = $('#mini-bar-chart');
    var miniBarChart = new Chart(miniBar, {
      type: 'bar',
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [{
          data: [12, 19, 4, 5, 9, 3, 7, 2, 3, 2, 4, 14],
          backgroundColor: chartColorBlue,
        }]
      },
      options: flushChartOptions
    });


    // Area Charts
    var data = {
      labels: ['one', 'two', 'three', 'four', 'five'],
      datasets: [{
        backgroundColor: rgbToRgba(chartColorPink, '.25'),
        borderColor: chartColorPink,
        pointBackgroundColor: chartColorPink,
        pointBorderColor: rgbToRgba(chartColorPink, '.25'),
        data: [2,4,7,3,8],
        label: 'D0'
      }, {
        backgroundColor: rgbToRgba(chartColorBlue, '.25'),
        borderColor: chartColorBlue,
        pointBackgroundColor: chartColorBlue,
        pointBorderColor: rgbToRgba(chartColorBlue, '.25'),
        data: [9,4,5,1,3],
        label: 'D1',
      }]
    };

    var $areaChart = $('#area-chart');
    var areaChart = new Chart($areaChart, {
      type: 'line',
      data: data,
      options: areaOptions
    });



    var data = {
      labels: ['one', 'two', 'three', 'four', 'five'],
      datasets: [{
        backgroundColor: chartColorPink,
        borderColor: chartColorPink,
        data: [2,4,7,3,8],
        label: 'D0',
        pointHoverRadius: 3,
        pointHoverBorderWidth: 1
      }, {
        backgroundColor: chartColorYellow,
        borderColor: chartColorYellow,
        data: [2,5,5,7,3],
        label: 'D1',
        pointHoverRadius: 3,
        pointHoverBorderWidth: 1
      }, {
        backgroundColor: chartColorBlue,
        borderColor: chartColorBlue,
        data: [9,4,5,1,3],
        label: 'D1',
        pointHoverRadius: 3,
        pointHoverBorderWidth: 1
      }]
    };
    var $flushAreaChart = $('#flush-area-chart');
    var flushAreaChart = new Chart($flushAreaChart, {
      type: 'line',
      data: data,
      options: flushChartOptions
    });

    var miniLineArea = $('#mini-line-area-chart');
    var myMiniLineAreaChart = new Chart(miniLineArea, {
      type: 'line',
      data: data,
      options: flushChartOptions
    });


    var doughnutTooltip = Object.assign({}, tooltipsOpts);
    doughnutTooltip.intersect = true;
    delete doughnutTooltip.mode;


    // Doughnut Chart
    var doughnutChart = $('#doughnut-chart');
    var doughnutTooltip = Object.assign({}, tooltipsOpts);
    doughnutTooltip.intersect = true;
    doughnutTooltip.callbacks = { footer: percentageFooterCallback };
    delete doughnutTooltip.mode;

    var miniDoughnutChart = $('#mini-doughnut-chart');
    var miniDoughnutChartJS = new Chart(miniDoughnutChart, {
      type: 'doughnut',
      data: {
        labels: ["Red", "Blue", "Yellow", "Green"],
        datasets: [{
          label: 'dataset 1',
          data: [12, 19, 3, 5],
          backgroundColor: [chartColorPink, chartColorBlue, chartColorYellow, chartColorGreen],
          borderWidth: 0
        }],
      },
      options: {
        tooltips: doughnutTooltip,
        cutoutPercentage: 80
      }
    });


    /********************
     *    DataTables    *
     ********************/
    var table = $('#default-table-example').DataTable({
      'ajax': 'https://api.myjson.com/bins/1us28',
      'language': {
        'search': '',
        'searchPlaceholder': 'Enter search term'
      },
      'order': [0, 'asc'],
      'dom': 'ft<"footer-wrapper"l<"paging-info"ip>>',
      'scrollY': '400px',
      'scrollCollapse': true,
      'pagingType': 'full',
      'drawCallback': function( settings ) {
        var api = this.api();

        // Add waves to pagination buttons
        $(api.table().container()).find('.paginate_button').addClass('waves-effect');

        api.table().columns.adjust();
      }
    });


    /********************
     *     Calendar     *
     ********************/
    var todaysDate = new Date();
    var today = todaysDate.toISOString().substr(0,10);
    todaysDate.setDate(todaysDate.getDate() + 1);
    var tomorrow = todaysDate.toISOString().substr(0,10);
    todaysDate.setDate(todaysDate.getDate() - 3);
    var threeDaysAgo = todaysDate.toISOString().substr(0,10);
    var eventData = [
        {
          title: 'All Day Event',
          start: today
        },
        {
          title: 'Long Event',
          start: threeDaysAgo,
          end: today
        },
        {
          id: 999,
          title: 'Repeating Event',
          start: today + 'T16:00:00'
        },
        {
          id: 999,
          title: 'Repeating Event',
          start: today + 'T16:00:00'
        },
        {
          title: 'Meeting',
          start: today + 'T10:30:00',
          end: today + 'T12:30:00'
        },
        {
          title: 'Lunch',
          start: today + 'T12:00:00'
        },
        {
          title: 'Meeting',
          start: today + 'T14:30:00'
        },
        {
          title: 'Happy Hour',
          start: today + 'T17:30:00'
        },
        {
          title: 'Dinner',
          start: today + 'T20:00:00'
        },
        {
          title: 'Birthday Party',
          start: tomorrow + 'T07:00:00'
        },
        {
          title: 'Click for Google',
          url: 'http://google.com/',
          start: today
        }
      ];
    $('#calendar').fullCalendar({
      header: {
        left: 'prev,next,title',
        right: 'month,agendaWeek,agendaDay'
      },
      editable: true,
      eventLimit: true, // allow "more" link when too many events
      events: eventData,
      views: {
        agendaWeek: {
          columnFormat: 'DD'
        }
      }
    })
    $('#calendar-week').fullCalendar({
      header: {
        right: 'month,agendaWeek,agendaDay'
      },
      editable: true,
      eventLimit: true, // allow "more" link when too many events
      events: eventData,
      defaultView: 'agendaWeek',
      views: {
        agendaWeek: {
          columnFormat: 'DD'
        }
      }
    })
    $('#calendar-list').fullCalendar({
      header: {
        left: 'today,prev,next,title',
        right: ''
      },
      editable: true,
      eventLimit: true, // allow "more" link when too many events
      events: eventData,
      defaultView: 'listMonth',
      views: {
        list: {
          listDayFormat: 'ddd',
          listDayAltFormat: 'MMM D',
        }
      }
    })


  });
}( jQuery ));

(function ($) {
  $(document).ready(function(){

    // Candlestick
    var data = getRandomData('April 01 2017', 40);

    var candlestickTooltip = Object.assign({}, tooltipsOpts);
    candlestickTooltip.position = 'nearest';
    candlestickTooltip.mode = 'index';

    var candlestickChart = $('#candlestick-chart');
    var candlestickChartJS = new Chart(candlestickChart, {
      type: 'candlestick',
      data: {
        datasets: [{
          label: "CHRT - Chart.js Corporation",
          data: data,
          fractionalDigitsCount: 2,
          borderWidth: 2,
          borderColor: 'rgba(0,0,0,.2)'
        }]
      },
      options: {
        tooltips: candlestickTooltip
      },
    });

  });
}( jQuery ));

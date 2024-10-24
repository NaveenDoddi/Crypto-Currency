
google.charts.load('current', {'packages':['corechart']});

// Function to calculate days between selected date and today
function selectedCoinData() {
    const datePicker = document.getElementById('datePicker').value;
    let coin = document.getElementById('cryptoInput').value;

    if(!coin){
      coin = document.getElementById('coinSelect').value;
    }

  
    if (datePicker) {
      // Get today's date
      const today = new Date();
      
      // Parse the selected date
      const selectedDate = new Date(datePicker);
      
      // Calculate the time difference in milliseconds
      const timeDifference = today - selectedDate;
      
      // Convert time difference from milliseconds to days
      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

      fetchCryptoCoinData(days, coin)

    } else {
      document.getElementById('no_of_days').innerHTML = ' Please select a valid days .';
    }
}


async function fetchCryptoCoinData(days,coin) {

    // const response = await fetch('https://api.coingecko.com/api/v3/coins/'+coin.toLowerCase()+'/market_chart?vs_currency=usd&days='+days);
    // const data = await response.json();

    const response = localStorage.getItem('selectedCoinData')
    const data = JSON.parse(response)

    localStorage.setItem('selectedCoinData', JSON.stringify(data))
    
    var priceData = [
      ['Date', 'Price']
    ];

    var prices = [];

    var chartData = [
      ['Time', 'Market Caps', 'Total Volumes'],  // Define column headers
    ];
    var candleStickData = [
      [ 'date','Low', 'Opening', 'Closing', 'High']
    ]

    for (let i = 0; i < data.market_caps.length; i++) {

      const time = new Date(data.market_caps[i][0]); // Convert timestamp to Date
      const price = data.prices[i][1]
      const marketCap = data.market_caps[i][1];      // Get market cap value
      const totalVolume = data.total_volumes[i][1];  // Get total volume value

      let day = time.getDate(); // Day of the month (1-31)
      let month = time.getMonth() + 1; // Month (0-11, so add 1 to get 1-12)
      let year = time.getFullYear() % 2000

      let date = `${day}-${month}-${year}`;
      
      chartData.push([date, marketCap, totalVolume]); // Add both marketCap and totalVolume to chartData
      
      priceData.push([date, price])

      prices.push(price)
    }
    document.getElementById('selectedCoinCharts').style.display = "block"
    document.getElementById('no_of_days').innerText = days
    document.getElementById('selectedCoin').innerText = coin.toUpperCase();

    
    let groupedData = priceData.reduce((acc, [date, value]) => {
      if (!acc[date]) acc[date] = []; // Initialize array if date doesn't exist
      acc[date].push(value); // Push value into the array for that date
      return acc;
    }, {});    

    for(let i = 1; i < Object.values(groupedData).length; i++){

      var date = Object.keys(groupedData)[i].toString();
      var mini = Number( Math.min(...Object.values(groupedData)[i]).toFixed(2) );
      var maxi = Number( Math.max(...Object.values(groupedData)[i]).toFixed(2) );
      var opening = Number( Object.values(groupedData)[i][0].toFixed(2) );
      var closing = Number( Object.values(groupedData)[i].at(-1).toFixed(2) );

      candleStickData.push([ date, mini, opening, closing, maxi]);

    }

    // let market_and_volume_chartData = []
    // let groupedData1 = chartData.reduce((acc, [date, price, refPrice]) => {
    //   if (!acc[date]) acc[date] = []; // Initialize array if date doesn't exist
    //   acc[date].push({ price, refPrice }); // Push price and refPrice into array
    //   return acc;
    // }, {});

    // for(let i = 1; i < Object.values(groupedData1).length; i++){

    //   market_and_volume_chartData.push()

    // }

    // let summary = Object.entries(groupedData).map(([date, prices]) => {
    //   let low = Math.min(...prices);
    //   let high = Math.max(...prices);
    //   let opening = prices[0];  // First value is the opening price
    //   let closing = prices[prices.length - 1];  // Last value is the closing price
    
    //   return [ date, low, high, opening, closing ];
    // });


    // Calculate high, low, and average prices
    let highPrice = Math.max(...prices).toFixed(2)
    let lowPrice = Math.min(...prices).toFixed(2)
    let averagePrice = (prices.reduce((sum, price) => sum + price, 0) / prices.length).toFixed(2);

    // const latestMarketCap = marketCap[marketCaps.length - 1];
    
    // drawChart(chartData);
    drawCandleSticks(candleStickData);
    drawPriceChart(priceData);

    // google.charts.setOnLoadCallback(drawChart(chartData, days, coin));
    // google.charts.setOnLoadCallback(drawPriceChart(prices, coin));


    displaySelectedCoinData(coin, days, highPrice, lowPrice, averagePrice) 
    
    return chartData;

}

async function drawChart(chartData) {

  var data = google.visualization.arrayToDataTable(chartData);

  const options = {
    title: `Market Caps and Total Volumes`,
    titleTextStyle: { fontSize: 18, bold: true },
    curveType: 'function',  // Smooth lines
    width: '100%',
    chartArea: { left: '10%', width: '85%', height: '70%' },

    legend: { position: 'top', alignment: 'center', textStyle: { fontSize: 12 } },
    hAxis: { 
      title: 'Date', 
      slantedText: true,  // Angles dates to avoid overlap
      textStyle: { fontSize: 12 },
      gridlines: { color: '#e0e0e0' }
    },
    vAxis: { 
      title: 'Values (USD)', 
      format: 'short',
      textStyle: { fontSize: 12 },
      gridlines: { color: '#e0e0e0' } 
    },
    series: {
      0: { targetAxisIndex: 0, color: '#1f77b4', lineWidth: 2 },  // Market Caps in blue
      1: { targetAxisIndex: 1, color: '#ff7f0e', lineWidth: 2 } // Total Volumes in orange with dashed line
    },
    vAxes: {
      0: { title: 'Market Caps (USD)', textStyle: { fontSize: 12 } },  // Left vertical axis
      1: { title: 'Total Volumes (USD)', textStyle: { fontSize: 12 } } // Right vertical axis
    },
    tooltip: { isHtml: true },  // Enhance tooltips with HTML
    backgroundColor: '#f9f9f9'
  };


  var chart = new google.visualization.LineChart(document.getElementById('selectedCoinChart'));

  chart.draw(data, options);
}

function drawCandleSticks(data) {
  console.log('data', data)

  var data = google.visualization.arrayToDataTable(data);

  const options = {

    title: 'Prices',
    width: '100%',
    height: 400,
    // chartArea: { left: '10%', width: '80%', height: '70%' },

    titleTextStyle: { fontSize: 18, bold: true },
    legend: { position: 'top', alignment: 'center' },
    candlestick: {
      fallingColor: { strokeWidth: 0, fill: '#e53935' }, // Red for falling
      risingColor: { strokeWidth: 0, fill: '#43a047' }   // Green for rising
    },
    hAxis: {
      title: 'Date',
      slantedText: true,
      textStyle: { fontSize: 12 }
    },
    vAxis: {
      title: 'Market Cap (in trillions)',
      format: 'short',
      textStyle: { fontSize: 12 },
      gridlines: { color: '#e0e0e0' }
    },
    tooltip: { isHtml: true },
    backgroundColor: '#f5f5f5'
  };
  

  var chart = new google.visualization.CandlestickChart(document.getElementById('selectedCoinCandleChart'));
  chart.draw(data, options);
}

function drawPriceChart(priceData) {
  var data = google.visualization.arrayToDataTable(priceData);
  var options = {
    title: `Price Chart`,
    titleTextStyle: { fontSize: 18, bold: true },
    width: '100%',  // Responsive layout
    height: 400,
    bar: { groupWidth: '75%' },  // Balanced bar width for clarity
    legend: { position: 'top', alignment: 'center', textStyle: { fontSize: 12 } },
    hAxis: { 
        title: 'Date', 
        slantedText: true,  // Prevents label overlap
        textStyle: { fontSize: 12 },
        gridlines: { color: '#e0e0e0' } 
    },
    vAxis: { 
        title: 'Price (USD)', 
        format: 'short',  // Compact number format (e.g., 1.2M)
        textStyle: { fontSize: 12 },
        gridlines: { color: '#e0e0e0' }
    },
    chartArea: { left: '10%', width: '80%', height: '70%' },  // Optimize layout
    colors: ['#4285F4'],  // Use Google’s brand color for familiarity
    backgroundColor: { fill: '#f9f9f9' },  // Light background for readability
    tooltip: { isHtml: true },  // Enhanced tooltip display
    animation: { startup: true, duration: 500, easing: 'inAndOut' }  // Smooth rendering
  };

  var chart = new google.visualization.ColumnChart(document.getElementById("selectedCoinPriceChart"));
  chart.draw(data, options);
}

// Function to render selected coin data within no.of days
function displaySelectedCoinData(coin, days, highPrice, lowPrice, averagePrice, latestMarketCap) {
    
    document.getElementById('selectedCoinData').innerHTML = `
        <div>
            <div class="card">
                <div class="card-header">
                    <h5>${coin} prices(usd) in last ${days} days</h5>
                </div>
                <div class="card-body">
                    <h5 class="card-title">Avg Price: ${averagePrice}</h5>
                    <p> High: ${highPrice}</p>
                    <p> Low: ${lowPrice}</p>
                </div>
            </div>
        </div>
    `;
}

function defaultDatePicker(){
  const today = new Date();
      
  const yesterday = new Date(today.getTime() -(3 * 86400000));
  const formattedDate = yesterday.toISOString().split('T')[0];

  document.getElementById('datePicker').value = formattedDate;
};

defaultDatePicker();
selectedCoinData(); 
// window.addEventListener('resize', drawChart(chartData), drawCandleSticks(candleStickData), drawPriceChart(priceData));
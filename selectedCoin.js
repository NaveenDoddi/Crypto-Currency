
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

    // localStorage.setItem('selectedCoinData', JSON.stringify(data))
    
    var prices = [];
    var chartData = [
      ['Time', 'Market Caps', 'Total Volumes'],  // Define column headers
    ];

    for (let i = 0; i < data.market_caps.length; i++) {
      const time = new Date(data.market_caps[i][0]); // Convert timestamp to Date
      const marketCap = data.market_caps[i][1];      // Get market cap value
      const totalVolume = data.total_volumes[i][1];  // Get total volume value
      chartData.push([time, marketCap, totalVolume]); // Add both marketCap and totalVolume to chartData
      prices.push(data.prices[i][1])
    }
    document.getElementById('selectedCoinDisplayDiv').style.display = "block"
    document.getElementById('no_of_days').innerText = days
    document.getElementById('selectedCoin').innerText = coin.toUpperCase();

    // Calculate high, low, and average prices
    const highPrice = Math.max(...prices);
    const lowPrice = Math.min(...prices);
    const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;

    // const latestMarketCap = marketCap[marketCaps.length - 1];
    
    // drawChart(coin, days);
    google.charts.setOnLoadCallback(drawChart);


    displaySelectedCoinData(coin, days, highPrice, lowPrice, averagePrice) 
    
    return chartData;

    // if (days <= 1) {

    //   prices = prices;
    // } else {
    //   // Convert timestamps and group prices by day
    //   const groupedPrices = prices.reduce((acc, price) => {
    //     // Create a unique key combining date and time (e.g., "YYYY-MM-DDTHH:mm:ss")
    //     const dateKey = price.time.toISOString(); // Full ISO string for unique timestamp
    //     console.log(dateKey)
    //     if (!acc[dateKey]) {
    //       acc[dateKey] = price; // Add the first occurrence of the specific timestamp
    //     }
    //     return acc;
    //   }, {});
      
    
    //   prices = Object.values(groupedPrices);
      
    // }

    }

async function drawChart(coin, days) {
  const chartData = await fetchCryptoCoinData(days, coin);  // Fetch Bitcoin data for 3 days

  var data = google.visualization.arrayToDataTable(chartData);

  var options = {
    title: `${coin} Market Caps and Total Volumes Over the Last ${days} Days`,
    curveType: 'function',
    legend: { position: 'bottom' },
    hAxis: { title: 'Time' },
    vAxis: { title: 'Values (USD)' },
    series: {
      0: { targetAxisIndex: 0 },  // Market Caps on left axis
      1: { targetAxisIndex: 1 }   // Total Volumes on right axis
    },
    vAxes: {
      0: { title: 'Market Caps (USD)' },  // Left vertical axis title
      1: { title: 'Total Volumes (USD)' } // Right vertical axis title
    }
  };

  var chart = new google.visualization.LineChart(document.getElementById('selectedCoinChart'));

  chart.draw(data, options);
}

// google.charts.setOnLoadCallback(drawChart);

// Function to render selected coin data within no.of days
function displaySelectedCoinData(coin, days, averagePrice, highPrice, lowPrice, latestMarketCap) {
    
    document.getElementById('selectedCoinData').innerHTML = `
        <div>
            <div class="card">
                <div class="card-header">
                    <h5>${coin} prices(usd) in last ${days} days</h5>
                </div>
                <div class="card-body">
                    <h5 class="card-title">Average Price: ${averagePrice.toLocaleString()}</h5>
                    <p> High: ${highPrice.toLocaleString()}</p>
                    <p> Low: ${lowPrice.toLocaleString()}</p>
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
}
defaultDatePicker();
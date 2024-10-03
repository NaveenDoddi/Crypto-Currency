
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

      document.getElementById('no_of_days').innerText = days
      document.getElementById('selectedCoin').innerText = coin.toUpperCase();
      fetchBitcoinData(days, coin)

    } else {
      document.getElementById('no_of_days').innerHTML = ' Please select a valid days .';
    }
}

async function fetchBitcoinData(days,coin) {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/'+coin.toLowerCase()+'/market_chart?vs_currency=usd&days='+days);
    const data = await response.json();
    
    let prices = data.prices.map(price => ({
      time: new Date(price[0]), // Convert timestamp to Date
      value: price[1]           // Bitcoin price in USD
    }));

    // Extract prices and market caps
    const pricesList = data.prices.map(price => price[1]);
    const marketCaps = data.market_caps.map(cap => cap[1]);
  
    // Calculate high, low, and average prices
    const highPrice = Math.max(...pricesList);
    const lowPrice = Math.min(...pricesList);
    const averagePrice = pricesList.reduce((sum, price) => sum + price, 0) / pricesList.length;

    const latestMarketCap = marketCaps[marketCaps.length - 1];
    

    if (days <= 5) {

      prices = prices;
    } else {
      // Convert timestamps and group prices by day
      const groupedPrices = prices.reduce((acc, price) => {
        const dateKey = price.time.toISOString().split('T')[0]; // Extract YYYY-MM-DD from date
        if (!acc[dateKey]) {
          acc[dateKey] = price; // Add the first occurrence of the day
        }
        return acc;
      }, {});
    
      prices = Object.values(groupedPrices);
    }

    renderChart(prices, coin);

    displaySelectedCoinData(coin, days, averagePrice, highPrice, lowPrice, latestMarketCap)
    
}
  
// Function to render chart using Chart.js
let selectedCoinChart

function renderChart(prices, coin) {
    
  const ctx = document.getElementById('selectedCoinChart').getContext('2d');

  if (selectedCoinChart) {
      selectedCoinChart.destroy();
  }

  selectedCoinChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: prices.map(p => p.time.toLocaleDateString()), // Dates for x-axis
      datasets: [{
        label: coin+' Price (USD)',
        data: prices.map(p => p.value), // Prices for y-axis
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        fill: false
      }]
    },
    options: {
      scales: {
        x: {
          type: 'time',
          time: {
              unit: 'week',
              tooltipFormat: 'll'
          },
        }
      }
    }
  });
}

// Function to render selected coin data within no.of days
function displaySelectedCoinData(coin, days, averagePrice, highPrice, lowPrice, latestMarketCap) {
    
    document.getElementById('selectedCoinData').innerHTML = `
        <div class="col-md-6">
            <div class="card">
                <div class="card-header">
                    <h5>${coin} prices(usd) in last ${days} days</h5>
                </div>
                <div class="card-body">
                    <h5 class="card-title">Average Price: ${averagePrice.toLocaleString()}</h5>
                    <p> High: ${highPrice.toLocaleString()}</p>
                    <p> Low: ${lowPrice.toLocaleString()}</p>
                    <p>Market Cap: ${latestMarketCap.toLocaleString()}</p>
                </div>
            </div>
        </div>
    `;
}
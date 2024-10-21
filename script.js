let priceChart, changeChart, marketCapChart;
let allData = []; // Store all the fetched data to filter and update charts
let COIN_LIMIT = 10; // Set the limit for the number of coins to display
let currentDisplayCount = 10; // Starting number of coins displayed
const increment = 10; // Number of cards to display each time the button is clicked
let chartData = [['Coin', 'Low', 'Opening', 'Closing', 'High']]
let marketCaps = [['Name', 'MarketCap']];

google.charts.load('current', {'packages': ['corechart']});

async function fetchCryptoData() {

    // const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd');
    // const data = await response.json();

    const response = localStorage.getItem('cryptoData')
    const data = JSON.parse(response)

    allData = data;
    localStorage.setItem("cryptoData", JSON.stringify(allData));

    const sortedData = allData.sort((a, b) => b.current_price - a.current_price);

    chartData = arrangeData(sortedData.slice(5, currentDisplayCount+3));
    displayData(sortedData.slice(0, currentDisplayCount+3));
    

}

function arrangeData(data){

    data.forEach(coin => {
        const name = coin.name;
        const current = Number(coin.current_price.toFixed(2))
        const h24 = Number(coin.high_24h.toFixed(2));
        const l24 = Number(coin.low_24h.toFixed(2));
        const ath = Number(coin.ath.toFixed(2));
        const atl = Number(coin.atl.toFixed(2));

        chartData.push([name, l24, l24, current, h24]);
    })

    return chartData
}

async function displayData(data) {
    const container = document.getElementById('crypto-data');
    container.innerHTML = ''; // Clear previous content

    const prices = [], labels = [], priceChanges = []

    data.forEach(coin => {
        const name = coin.name;
        const current = Number(coin.current_price.toFixed(2))
        const h24 = Number(coin.high_24h.toFixed(2));
        const l24 = Number(coin.low_24h.toFixed(2));
        const ath = Number(coin.ath.toFixed(2));
        const atl = Number(coin.atl.toFixed(2));

        const card = document.createElement('div');
        card.className = 'col-lg-3 col-md-4 col-sm-6 coin-card';
        card.dataset.marketCap = coin.market_cap;
        card.dataset.priceChange = coin.price_change_percentage_24h;
        
        card.innerHTML = `
            <div class="card shadow-sm mb-4">
                <div class="card-body" onclick="toggleDetails(this)" style="cursor: pointer;">
                    <h5 class="card-title text-center">${name}</h5>
                    <div class="card-text d-flex justify-content-between">
                        <img src="${coin.image}" alt="${name}" class="rounded-circle border border-secondary" style="width: 40px; height: 40px; margin-right: 10px;">
                        <span class="font-weight-bold">${coin.symbol.toUpperCase()}</span>
                    </div>
                    <div class="collapse-content mt-3 p-3" style="border-radius:10px">
                        <p><strong>24h High:</strong> ${h24.toFixed(2)}</p>
                        <p><strong>ATH:</strong> ${ath.toFixed(2)}</p>
                        <p><strong>24h Low:</strong> ${l24.toFixed(2)}</p>
                        <p><strong>ATL:</strong> ${atl.toFixed(2)}</p>
                        <p><strong>24h Profit/Loss:</strong> ${coin.price_change_percentage_24h.toFixed(2)}%</p>
                        <p><strong>Market Cap Change 24h:</strong> ${coin.market_cap_change_24h.toLocaleString()}</p>
                    </div>
                </div>
                <div class="card-footer bg-white d-flex justify-content-between align-items-center">
                    <div class="price">
                        <strong>Price:</strong> $${current}
                    </div>
                    <div class="market-cap">
                        <strong>Market-Cap:</strong> $${coin.market_cap.toLocaleString()}
                    </div>
                    <div class="change">                        
                        <span class="badge ${coin.price_change_percentage_24h >= 0 ? 'bg-success' : 'bg-danger'}">
                            ${coin.price_change_percentage_24h.toFixed(2)}%
                        </span>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);

        // prices.push(coin.current_price);
        // labels.push(coin.name);
        // priceChanges.push(coin.price_change_percentage_24h);
        marketCaps.push([coin.name, coin.market_cap]);


        let totalChange = 0;
        prices.forEach(coin => {
          totalChange += coin
        });

        let averageChange = totalChange / prices.length;


    });
    // display charts 
    google.charts.setOnLoadCallback(drawPriceChart);
    
    google.charts.setOnLoadCallback(drawMarketChart);

}

// Show more function
function showMore() {
    currentDisplayCount += increment;
    displayData(chartData.slice(0, currentDisplayCount)); // Update display to show more coins
}

// Search functionality
document.getElementById('searchBar').addEventListener('input', function () {
    const searchValue = this.value.toLowerCase();
    const filteredData = allData.filter(coin => coin.name.toLowerCase().includes(searchValue));
    chartData = filteredData
    displayData(filteredData.slice(0, COIN_LIMIT)); // Update UI and charts
});

// Filter functionality
document.getElementById('filterBar').addEventListener('change', function () {
    const filterValue = this.value;
    let filteredData = [...allData];

    if (filterValue === 'highMarketCap') {
        filteredData = filteredData.filter(coin => coin.market_cap >= 1000000000);
    } else if (filterValue === 'lowMarketCap') {
        filteredData = filteredData.filter(coin => coin.market_cap < 1000000000);
    } else if (filterValue === 'positiveChange') {
        filteredData = filteredData.filter(coin => coin.price_change_percentage_24h > 0);
    } else if (filterValue === 'negativeChange') {
        filteredData = filteredData.filter(coin => coin.price_change_percentage_24h <= 0);
    }
    chartData = filteredData
    displayData(filteredData.slice(0, COIN_LIMIT)); // Update UI and charts
});

function toggleDetails(element) {
    element.classList.toggle('active');
}

fetchCryptoData();

function drawPriceChart() {
    var data = google.visualization.arrayToDataTable(chartData);

    var options = {
      legend: 'none',
      candlestick: {
        fallingColor: { strokeWidth: 0, fill: '#a52714' }, // red
        risingColor: { strokeWidth: 0, fill: '#0f9d58' }   // green
      }
    };
    var chart = new google.visualization.CandlestickChart(document.getElementById('price_chart'));
    chart.draw(data, options);
}

function drawMarketChart() {
    var data = google.visualization.arrayToDataTable(marketCaps);

    var options = {
        title: ` Market chart`,
        width: 600,
        height: 400,
        bar: {groupWidth: "95%"},
        legend: { position: "none" },
    };

    var chart = new google.visualization.ColumnChart(document.getElementById('marketCap_chart'));
    chart.draw(data, options);
}

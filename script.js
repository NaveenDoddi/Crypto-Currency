let priceChart, changeChart, marketCapChart;
let COIN_LIMIT = 10; // Set the limit for the number of coins to display
let currentDisplayCount = 10; // Starting number of coins displayed
const increment = 10; // Number of cards to display each time the button is clicked
let marketCaps = [['Name', 'MarketCap']];
var allData = []

google.charts.load('current', {'packages': ['corechart']});

async function fetchCryptoData() {

    // const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd');
    // const data = await response.json();
    // localStorage.setItem("cryptoData", JSON.stringify(data));

    const response = localStorage.getItem('cryptoData')
    const data = JSON.parse(response)

    const sortedData = data.sort((a, b) => b.current_price - a.current_price);
    allData = [...sortedData].slice(4, sortedData.length)

    displayData(sortedData.slice(4, 13));

    var carouselData = data.slice(0, 4)
    displayCarousels(carouselData)

}
fetchCryptoData();

function arrangeData(data){
    var result = [['Coin', 'Opening', 'High', 'Closing']]

    data.forEach(coin => {
        const name = coin.name;
        const current = Number(coin.current_price.toFixed(2))
        const h24 = Number(coin.high_24h.toFixed(2));
        const l24 = Number(coin.low_24h.toFixed(2));
        const ath = Number(coin.ath.toFixed(2));
        const atl = Number(coin.atl.toFixed(2));

        result.push([name, l24, h24, current]);
    })

    return result
}

function displayCarousels(data){
    const carouselBody = document.getElementById('carouselBody');
    const carouselIndicators = document.getElementById("carousel-indicators");

    data.forEach((coin, index) => {

        const indicator = document.createElement("span");
        indicator.innerHTML = `
            <img type="button" src="${coin.image}" data-bs-target="#carouselIndicators" data-bs-slide-to="${index}" class="indicators" aria-current="true" aria-label="Slide ${index}">
        `
        carouselIndicators.append(indicator);

        const name = coin.name;
        const current = Number(coin.current_price.toFixed(2));
        const h24 = Number(coin.high_24h.toFixed(2));
        const l24 = Number(coin.low_24h.toFixed(2));
        const ath = Number(coin.ath.toFixed(2));
        const atl = Number(coin.atl.toFixed(2));

        const carousel = document.createElement('div');
        carousel.className = 'carousel-item';

        carousel.innerHTML = `
            <div class="card shadow-sm mb-4" style="border-radius: 12px;">
                <!-- Card Header -->
                <div class="card-header text-white text-center" style="border-radius: 12px 12px 0 0; background-color:#0f0f23;">
                    <h5 class="card-title mb-2">${name}</h5>
                    <div class="card-text d-flex align-items-center justify-content-around">
                        <img src="${coin.image}" alt="${name}" class="rounded-circle border border-light" style="width: 40px; height: 40px; margin-right: 10px;">
                        <span class="font-weight-bold text-uppercase">${coin.symbol}</span>
                    </div>
                </div>

                <!-- Card Body -->
                <div class="card-body bg-light" style="border-radius: 0 0 12px 12px;">
                    <!-- Price, Market Cap, and Change Section -->
                    <div class="d-flex justify-content-around align-items-center py-2">
                        <div class="price text-center">
                            <strong>Price:</strong> <span class="text-primary">$${current}</span>
                        </div>
                        <div class="market-cap text-center">
                            <strong>Market Cap:</strong> <span class="text-secondary">$${coin.market_cap.toLocaleString()}</span>
                        </div>
                        <div class="change text-center">                
                            <span class="badge ${coin.price_change_percentage_24h >= 0 ? 'bg-success' : 'bg-danger'}">
                                ${coin.price_change_percentage_24h.toFixed(2)}%
                            </span>
                        </div>
                    </div>

                    <!-- Detailed Table Section -->
                    <table class="table table-borderless mt-3 w-100">
                        <tbody>
                            <tr>
                                <td class="text-center">
                                    <strong>24h High:</strong> 
                                    <span class="text-success">$${h24.toFixed(2)}</span>
                                </td>
                                <td class="text-center">
                                    <strong>24h Low:</strong> 
                                    <span class="text-danger">$${l24.toFixed(2)}</span>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-center">
                                    <strong>All Time High:</strong> 
                                    <span class="text-success">$${ath.toFixed(2)}</span>
                                </td>
                                <td class="text-center">
                                    <strong>All Time Low:</strong> 
                                    <span class="text-danger">$${atl.toFixed(2)}</span>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-center" colspan="2">
                                    <strong>Market Cap Change:</strong> 
                                    <span class="text-secondary">$${coin.market_cap_change_24h.toLocaleString()}</span>
                                </td>
                            </tr>
                            
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="2"></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

        `
        carouselBody.appendChild(carousel);

    })

    document.getElementsByClassName("carousel-item")[0].className = "carousel-item active"
    document.getElementsByClassName("indicators")[0].className = "indicators active"
}

function displayData(data) {
    
    data = data.slice(0, currentDisplayCount+3)
    
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
            <div class="card shadow-sm mb-4" style="border-radius: 15px 15px 0 0">
                <div class="card-body" onclick="toggleDetails(this)" onmouseenter="toggleDetails(this)" style="cursor: pointer; background-color: #0f0f23; border-radius: 15px 15px 0 0">
                    <h5 class="card-title text-center">${name}</h5>
                    
                    <div class="card-text d-flex justify-content-between">
                        <img src="${coin.image}" alt="${name}" class="rounded-circle border border-secondary" style="width: 40px; height: 40px; margin-right: 10px;">
                        <span class="text-light">${coin.symbol.toUpperCase()}</span>
                    </div>

                    <div class="collapse-content mt-3 p-3" style="color: rgb(0, 87, 128);">
                        <p><strong>24h High:</strong> ${h24.toFixed(2)}</p>
                        <p><strong>ATH:</strong> ${ath.toFixed(2)}</p>
                        <p><strong>24h Low:</strong> ${l24.toFixed(2)}</p>
                        <p><strong>ATL:</strong> ${atl.toFixed(2)}</p>
                        <p><strong>24h Profit/Loss:</strong> ${coin.price_change_percentage_24h.toFixed(2)}%</p>
                        <p><strong>Market Cap Change 24h:</strong> ${coin.market_cap_change_24h.toLocaleString()}</p>
                    </div>
                    
                </div>
                
                <div class="card-footer bg-white d-flex justify-content-between align-items-center"style="color: rgb(0, 87, 128);">
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
    let chartData = arrangeData(data) 
    google.charts.setOnLoadCallback(() => drawPriceChart(chartData));
    // setTimeout(google.charts.setOnLoadCallback(drawPriceChart(chartData)), 1000);
    // google.charts.setOnLoadCallback(drawMarketChart);

}

async function drawPriceChart(data){

    var data = await google.visualization.arrayToDataTable(data);

    const options = {

        title: 'Coin Prices in 24h',
        width: '100%',
        height: 400,
        chartArea: { left: '10%', width: '90%' },
    
        titleTextStyle: { fontSize: 18, bold: true },
        legend: { position: 'top', alignment: 'center' },
        colors:['lightgreen', 'green','#20b2aa'],
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
      
    var chart = new google.visualization.ColumnChart(document.getElementById('price_chart'));
    chart.draw(data, options);
}

// Search functionality
const input = document.getElementById("searchBar"); 
input.addEventListener("input", () => { 
    const searchValue = input.value.toLowerCase();
    const filteredData = allData.filter(coin => coin.name.toLowerCase().includes(searchValue));
    // chartData = arrangeData(filteredData)
    
    // displayData(filteredData.slice(0, COIN_LIMIT)); // Update UI and charts
    displayData(filteredData); // Update UI and charts
});

// Filter functionality
function filteringCoins(){

    const filterValue =document.getElementById('filterBar').value
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
    
    displayData(filteredData); // Update UI and charts
};

function drawMarketChart() {
    var data = google.visualization.arrayToDataTable(marketCaps);

    var options = {
        title: `MarketPrice Chart`,
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
    

    var chart = new google.visualization.ColumnChart(document.getElementById('marketCap_chart'));
    chart.draw(data, options);
}

// Show more function
function showMore() {
    currentDisplayCount += increment;
    displayData(allData); // Update display to show more coins
}

function toggleDetails(element) {
    element.classList.toggle('active');
}

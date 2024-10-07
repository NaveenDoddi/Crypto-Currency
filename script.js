let priceChart, changeChart, marketCapChart;
let allData = []; // Store all the fetched data to filter and update charts
let COIN_LIMIT = 10; // Set the limit for the number of coins to display
let currentDisplayCount = 10; // Starting number of coins displayed
const increment = 10; // Number of cards to display each time the button is clicked

async function fetchCryptoData() {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd');
    const data = await response.json();

    // const response = localStorage.getItem('cryptoData')
    // const data = JSON.parse(response)

    allData = data;
    localStorage.setItem("cryptoData", JSON.stringify(allData));

    const sortedData = allData.sort((a, b) => b.current_price - a.current_price);

    displayData(sortedData.slice(0, currentDisplayCount+3));}

function displayData(data) {
    const container = document.getElementById('crypto-data');
    container.innerHTML = ''; // Clear previous content

    const prices = [], labels = [], priceChanges = [], marketCaps = [];

    data.forEach(coin => {
        const card = document.createElement('div');
        card.className = 'col-lg-4 col-md-6 col-sm-12 coin-card';
        card.dataset.marketCap = coin.market_cap;
        card.dataset.priceChange = coin.price_change_percentage_24h;
        card.innerHTML = `
            <div class="card shadow-sm mb-4">
                <div class="card-body" onclick="toggleDetails(this)" style="cursor: pointer;">
                    <h5 class="card-title text-center">${coin.name}</h5>
                    <div class="card-text d-flex justify-content-between">
                        <img src="${coin.image}" alt="${coin.name}" class="rounded-circle border border-secondary" style="width: 40px; height: 40px; margin-right: 10px;">
                        <span class="font-weight-bold">${coin.symbol.toUpperCase()}</span>
                    </div>
                    <div class="collapse-content mt-3 p-3" style="border-radius:10px">
                        <p><strong>24h High:</strong> ${coin.high_24h.toFixed(2)}</p>
                        <p><strong>ATH:</strong> ${coin.ath.toFixed(2)}</p>
                        <p><strong>24h Low:</strong> ${coin.low_24h.toFixed(2)}</p>
                        <p><strong>ATL:</strong> ${coin.atl.toFixed(2)}</p>
                        <p><strong>24h Profit/Loss:</strong> ${coin.price_change_percentage_24h.toFixed(2)}%</p>
                        <p><strong>Market Cap Change 24h:</strong> ${coin.market_cap_change_24h.toLocaleString()}</p>
                    </div>
                </div>
                <div class="card-footer bg-white d-flex justify-content-between align-items-center">
                    <div class="price">
                        <strong>Price:</strong> $${coin.current_price.toFixed(2)}
                    </div>
                    <div class="market-cap">
                        <strong>Market Cap:</strong> $${coin.market_cap.toLocaleString()}
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

        prices.push(coin.current_price);
        labels.push(coin.name);
        priceChanges.push(coin.price_change_percentage_24h);
        marketCaps.push(coin.market_cap);

        let totalChange = 0;
        prices.forEach(coin => {
          totalChange += coin
        });

        let averageChange = totalChange / prices.length;
        console.log("Average 24h change:", averageChange);

    });

    // Update all charts based on limited data
    updateChart(priceChart, labels, prices, 'Price in USD', 'rgb(245, 200, 142)');
    updateChart(changeChart, labels, priceChanges, '24h Change (%)', 'rgba(75, 192, 192, 0.6)');
    updateChart(marketCapChart, labels, marketCaps, 'Market Cap in USD', 'rgba(153, 102, 255, 0.6)');
}

function updateChart(chart, labels, data, label, backgroundColor) {
    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.data.datasets[0].label = label;
    chart.data.datasets[0].backgroundColor = backgroundColor;
    chart.update();
}

function createCharts() {
    const priceCtx = document.getElementById('priceChart').getContext('2d');
    const changeCtx = document.getElementById('changeChart').getContext('2d');
    const marketCapCtx = document.getElementById('marketCapChart').getContext('2d');

    priceChart = new Chart(priceCtx, createChartConfig());
    changeChart = new Chart(changeCtx, createChartConfig());
    marketCapChart = new Chart(marketCapCtx, createLineChartConfig());

    console.log(priceChart)
}

function createChartConfig() {
    return {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: '',
                data: [],
                backgroundColor: '',
                borderColor: '',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    };
}
function createLineChartConfig() {
    return {
        type: 'line',  // Line chart type
        data: {
            labels: [],  // X-axis labels
            datasets: [{
                label: 'Your Data Label',  // Label for the dataset
                data: [],   // Data points
                backgroundColor: 'rgba(210, 180, 140, 0.5)',  // Light brown area fill
                borderColor: 'rgba(33, 150, 243, 1)',  // Blue line color
                borderWidth: 2,  // Line thickness
                fill: true,  // Fill the area under the line
                pointRadius: 0,  // No bubbles at data points
                borderCapStyle: 'butt'  // Sharp edges for the line
            }]
        },
        options: {
            scales: {
                y: {  // Y-axis configuration
                    beginAtZero: true  // Start y-axis from 0
                },
                x: {  // X-axis configuration
                    display: true  // Display x-axis
                }
            },
            elements: {
                line: {
                    tension: 0  // Straight lines, no curve
                }
            },
            animation: {  // Enable drawing animation
                duration: 1000,  // Animation duration for drawing the chart (1 second)
                easing: 'easeInOutQuart'  // Easing function for a smooth animation
            },
            hover: {  // Enable hover animation
                mode: 'nearest',  // Nearest point hover mode
                intersect: false,  // Highlight the closest point
                animationDuration: 400  // Duration of hover animation (400ms)
            }
        }
    };
}



// Show more function
function showMore() {
    currentDisplayCount += increment;
    displayData(allData.slice(0, currentDisplayCount)); // Update display to show more coins
}

// Search functionality
document.getElementById('searchBar').addEventListener('input', function () {
    const searchValue = this.value.toLowerCase();
    const filteredData = allData.filter(coin => coin.name.toLowerCase().includes(searchValue));
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

    displayData(filteredData.slice(0, COIN_LIMIT)); // Update UI and charts
});

function toggleDetails(element) {
    element.classList.toggle('active');
}

fetchCryptoData();
createCharts();

const apiUrl = 'https://api.coingecko.com/api/v3/coins/bitcoin/history?date=30-01-2024';

fetch(apiUrl)
.then(response => response.json())
.then(data => {
    document.getElementById('loading').style.display = 'none';

    // Extract important data
    const { market_data, name } = data;
    const priceUsd = market_data.current_price.usd;
    const high24h = market_data.high_24h.usd;
    const low24h = market_data.low_24h.usd;
    const marketCap = market_data.market_cap.usd;
    const historicalPrices = [priceUsd, high24h, low24h]; // You can add more data if neede
    // Insert card data into HTML

    document.getElementById('data').innerHTML = `
        <div class="col-md-6">
            <div class="card">
                <div class="card-header">
                    <h4>${name} - January 30, 2024</h4>
                </div>
                <div class="card-body">
                    <h5 class="card-title">Current Price: $${priceUsd.toLocaleString()}</h5>
                    <p>24h High: $${high24h.toLocaleString()}</p>
                    <p>24h Low: $${low24h.toLocaleString()}</p>
                    <p>Market Cap: $${marketCap.toLocaleString()}</p>
                </div>
            </div>
        </div>
    `;

    // Create Line Chart for Price Data
    const ctx = document.getElementById('priceChart').getContext('2d');
    const priceChart = new Chart(ctx, {
        type: 'line', // Line chart
        data: {
            labels: ['Current Price', '24h High', '24h Low'], // X-axis labels
            datasets: [{
                label: 'Price in USD',
                data: historicalPrices, // Data points (Current Price, High, Low)
                backgroundColor: 'rgba(247, 147, 26, 0.2)', // Area under the line
                borderColor: 'rgba(247, 147, 26, 1)', // Line color
                borderWidth: 2,
                fill: true, // Fill the area under the line
                tension: 0.4 // Smoother curve
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Bitcoin Price Data - January 30, 2024'
                }
            },
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
})
.catch(error => {
    document.getElementById('loading').innerText = 'Failed to load data.';
    console.error('Error fetching data:', error);
});
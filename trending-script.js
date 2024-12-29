fetch('https://api.coingecko.com/api/v3/search/trending')
.then(response => response.json())
.then(data => {
    
    // // localStorage.setItem('trending', JSON.stringify(data))
  
    // let data = localStorage.getItem('trending')
    // data = JSON.parse(data)

    const coins = data.coins;

    const outerCirle = document.getElementsByClassName('outer-circle-container')[0];
    const innerCircle = document.getElementsByClassName('inner-circle-container')[0];
    
    for(let coin = 0; coin < 14; coin++) {
        const coinDiv = document.createElement('div');
        coinDiv.classList.add('square');
        
        const coinImage = document.createElement('img');
        coinImage.src = coins[coin].item.small;  
        const coinName = document.createElement('div');
        coinName.textContent = coins[coin].item.name;

        coinDiv.appendChild(coinImage);
        // coinDiv.appendChild(coinName);

        if(coin < 6){
          innerCircle.appendChild(coinDiv);
          
        }else if(coin >= 6){
          outerCirle.appendChild(coinDiv);
          
        }
    };

    const categories = data.categories
    const categoryContainer = document.getElementById('category-container');

    if (categories && categories.length > 0) {

        categories.forEach(category => {
          displayCoinCategoryData(category);
        })

    }
})

function displayCoinCategoryData(data) {
  const coinDetailsContainer = document.getElementById('coin-details-container');

    const cardDiv = document.createElement('div');
    cardDiv.classList.add('col-xl-2','col-lg-3','col-md-4', 'col-sm-6','col-10' , 'coin-detail-card', 'p-1'); 

    cardDiv.innerHTML = `
        <div class="card h-100 m-0">
          <div class="card-body text-center p-0">
              <!-- Card title is always visible -->
              <h6 class="card-titl p-2 text-light rounded" style = "cursor: pointer; background-color:${data.data.market_cap_change_percentage_24h.aed >= 0 ? '#0f0f23':'#3a3a65'}" data-toggle="collapse" data-target="#collapse${data.id}" aria-expanded="false" aria-controls="collapse${data.id}">
                  <a href='#${data.name}' class="pe-auto text-decoration-none" style="color: white">
                      ${data.name}
                  </a>
                  <i class="fa-solid bg-light p-1 ${data.data.market_cap_change_percentage_24h.aed >= 0 ? "fa-arrow-up-wide-short text-success":"fa-arrow-down-wide-short text-danger"}"></i>
              </h6>

              <!-- Collapsible card content -->
              <div id="collapse${data.id}" class="collapse">
                  <p class="card-text"><strong>Market Cap:</strong> $${data.data.market_cap.toLocaleString()}</p>
                  <p class="card-text"><strong>Total Volume:</strong> $${data.data.total_volume.toLocaleString()}</p>
                  <p class="card-text"><strong>Market Cap Change (1h):</strong> ${data.market_cap_1h_change.toFixed(2)}%</p>
                  <p class="card-text"><strong>Market Cap Change (24h):</strong> ${data.data.market_cap_change_percentage_24h.aed.toFixed(2)}% (AED)</p>
                  <img class='w-100' src="${data.data.sparkline}" class="img-fluid rounded" alt="Sparkline Chart" />
              </div>
          </div>
      </div>

    `;

    coinDetailsContainer.appendChild(cardDiv);
}

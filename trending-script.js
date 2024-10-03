// fetch('https://api.coingecko.com/api/v3/search/trending')
// .then(response => response.json())
// .then(data => {
    let data = localStorage.getItem('trending')
    data = JSON.parse(data)

    const coins = data.coins;
    const coinList = document.getElementById('coin-list');
    
    coins.forEach(coin => {
        const coinDiv = document.createElement('div');
        coinDiv.classList.add('coin');
        
        const coinImage = document.createElement('img');
        coinImage.src = coin.item.small;  
        const coinName = document.createElement('p');
        coinName.textContent = coin.item.name; 

        coinDiv.appendChild(coinImage);
        coinDiv.appendChild(coinName);
        
        coinList.appendChild(coinDiv);
    });

      // const nfts = data.nfts;  // Assuming data.nfts contains the NFT information
      // const nftContainer = document.getElementById('nft-container');
      

      // if (nfts && nfts.length > 0) {

      //   nfts.forEach(nft => {
      //       const nftDiv = document.createElement('div');
      //       nftDiv.classList.add('col-md-4', 'nft-card');
      
      //       const nftImage = document.createElement('img');

      //       nftImage.src = nft.thumb;
      //       const nftName = document.createElement('h5');
      //       nftName.textContent = nft.name; 
      //       const nftDescription = document.createElement('p');
      //       nftDescription.textContent = nft.description; 
      
      //       // Append elements to the nft card div
      //       nftDiv.appendChild(nftImage);
      //       nftDiv.appendChild(nftName);
      //       nftDiv.appendChild(nftDescription);
      
      //       // Append the nft card div to the container
      //       nftContainer.appendChild(nftDiv);
      //     });
      // } else {
      //       // Show a message if no NFTs are found
      //       nftContainer.innerHTML = '<p>No NFTs found.</p>';
      // }

      const categories = data.categories
      const categoryContainer = document.getElementById('category-container');

      if (categories && categories.length > 0) {

        categories.forEach(category => {
          displayCoinCategoryData(category);
        })

      }

function displayCoinCategoryData(data) {
  const coinDetailsContainer = document.getElementById('coin-details-container');

    const cardDiv = document.createElement('div');
    cardDiv.classList.add('col-md-4', 'col-sm-6', 'coin-detail-card', 'p-1'); 

    cardDiv.innerHTML = `
        <div class="card h-100 m-0">
          <div class="card-body text-center p-0">
              <!-- Card title is always visible -->
              <h5 class="card-title p-2 text-light rounded " style = "background-color:${data.data.market_cap_change_percentage_24h.aed >= 0 ? 'rgb(111, 78, 55)':'rgb(59, 30, 4)'}" data-toggle="collapse" data-target="#collapse${data.id}" aria-expanded="false" aria-controls="collapse${data.id}">
                  <a href='#${data.name}' class="pe-auto text-decoration-none" style="color: white">
                      ${data.name}
                  </a>
              </h5>

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

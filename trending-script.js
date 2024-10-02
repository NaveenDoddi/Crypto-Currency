// fetch('https://api.coingecko.com/api/v3/search/trending')
// .then(response => response.json())
// .then(data => {
    let data = localStorage.getItem('trending')
    data = JSON.parse(data)

    const coins = data.coins;
    const coinList = document.getElementById('coin-list');
    
    // Create small divs for each coin and add them to the coin-list container
    coins.forEach(coin => {
        const coinDiv = document.createElement('div');
        coinDiv.classList.add('coin');
        
        const coinImage = document.createElement('img');
        coinImage.src = coin.item.small;  // Coin image
        const coinName = document.createElement('p');
        coinName.textContent = coin.item.name;  // Coin name

        // Append image and name to the coin div
        coinDiv.appendChild(coinImage);
        coinDiv.appendChild(coinName);
        
        // Append the coin div to the scrolling container
        coinList.appendChild(coinDiv);
    });

      const nfts = data.nfts;  // Assuming data.nfts contains the NFT information
      const nftContainer = document.getElementById('nft-container');
      
      // Check if there are any NFTs
      if (nfts && nfts.length > 0) {
          // Loop through each NFT category and create a card
          nfts.forEach(nft => {
            const nftDiv = document.createElement('div');
            nftDiv.classList.add('col-md-4', 'nft-card');
      
            // Create NFT image, name, and description
            const nftImage = document.createElement('img');

            nftImage.src = nft.thumb; // Assuming the NFT has an image property
            const nftName = document.createElement('h5');
            nftName.textContent = nft.name; // Assuming NFT has a name property
            const nftDescription = document.createElement('p');
            nftDescription.textContent = nft.description; // Assuming NFT has a description
      
            // Append elements to the nft card div
            nftDiv.appendChild(nftImage);
            nftDiv.appendChild(nftName);
            nftDiv.appendChild(nftDescription);
      
            // Append the nft card div to the container
            nftContainer.appendChild(nftDiv);
          });
      } else {
            // Show a message if no NFTs are found
            nftContainer.innerHTML = '<p>No NFTs found.</p>';
      }
          
// })

// .catch(error => {
//     console.error('Error fetching coins:', error);
// });

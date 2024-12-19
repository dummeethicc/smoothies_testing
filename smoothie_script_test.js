window.onload = () => {
  const wtfButton = document.getElementById('wtfButton');
  const trackerButton = document.getElementById('trackerButton');
  const explanationPopup = document.getElementById('explanationPopup');
  const trackerPopup = document.getElementById('trackerPopup');
  const closeExplanationPopup = document.getElementById('closeExplanationPopup');
  const closeTrackerPopup = document.getElementById('closeTrackerPopup');
  const outcomeModal = document.getElementById("outcomeModal");
  const closeOutcomeModal = document.getElementById("closeOutcomeModal");

  const mintButton = document.getElementById("mintButton");
  const blenderVideo = document.getElementById("blenderVideo");
  const connectWalletButton = document.getElementById("connectWallet");
  const walletOptions = document.getElementById("walletOptions");
  const cooperationModal = document.getElementById("cooperationModal");
  const cooperateButton = document.getElementById("cooperateButton");
  const stealButton = document.getElementById("stealButton");
  const title = document.getElementById("title");
  const outcomeMessage = document.getElementById("outcomeMessage");

  const smoothiesAvailable = document.getElementById("smoothiesAvailable");
  const smeewthMinted = document.getElementById("smeewthMinted");
  const smoothiesMinted = document.getElementById("smoothiesMinted");

  let walletAddress = ''; // To store the connected wallet address

  // Initialize tracker from localStorage
  function initializeTracker() {
    const available = localStorage.getItem('smoothiesAvailable') || '10000';
    const smeewth = localStorage.getItem('smeewthMinted') || '0';
    const smoothies = localStorage.getItem('smoothiesMinted') || '0';

    smoothiesAvailable.textContent = available;
    smeewthMinted.textContent = smeewth;
    smoothiesMinted.textContent = smoothies;
  }

  // Function to update the tracker UI and localStorage
  function updateTracker(outcome) {
    let available = parseInt(smoothiesAvailable.textContent);
    let smeewth = parseInt(smeewthMinted.textContent);
    let smoothies = parseInt(smoothiesMinted.textContent);

    if (outcome === '1 smoothie minted') {
      smoothies++;
      available--;
    } else if (outcome === '2 smoothies minted') {
      smoothies += 2;
      available -= 2;
    } else if (outcome === '1 SMEWTH token minted') {
      smeewth++;
    }

    smoothiesAvailable.textContent = available.toString();
    smeewthMinted.textContent = smeewth.toString();
    smoothiesMinted.textContent = smoothies.toString();

    localStorage.setItem('smoothiesAvailable', available.toString());
    localStorage.setItem('smeewthMinted', smeewth.toString());
    localStorage.setItem('smoothiesMinted', smoothies.toString());
  }

  // Wallet selection toggle
  if (connectWalletButton) {
    connectWalletButton.addEventListener("click", (event) => {
      event.stopPropagation();
      walletOptions.style.display = walletOptions.style.display === "block" ? "none" : "block";
    });
  }

  // Close wallet options if clicked outside
  document.addEventListener("click", (event) => {
    if (walletOptions && !walletOptions.contains(event.target) && !connectWalletButton.contains(event.target)) {
      walletOptions.style.display = "none";
    }
  });

  // Connect wallet function
  async function connectWallet(walletType) {
    try {
      let provider;
      if (walletType === "Phantom") {
        if (window.solana && window.solana.isPhantom) {
          provider = window.solana;
        } else {
          alert("Phantom wallet not detected.");
          return;
        }
      } else if (walletType === "Solflare") {
        if (window.solflare && window.solflare.isSolflare) {
          provider = window.solflare;
        } else {
          alert("Solflare wallet not detected.");
          return;
        }
      } else if (walletType === "Glow") {
        if (window.glowSolana && window.glowSolana.isGlow) {
          provider = window.glowSolana;
        } else {
          alert("Glow wallet not detected.");
          return;
        }
      } else {
        alert("Wallet not supported.");
        return;
      }

      const connected = await provider.connect();
      if (connected && connected.publicKey) {
        walletAddress = connected.publicKey.toString();
        console.log("Connected to wallet:", walletAddress);

        // Update the button to show the wallet address abbreviation
        const abbreviatedAddress = `${walletAddress.slice(0, 3)}...${walletAddress.slice(-4)}`;
        connectWalletButton.textContent = abbreviatedAddress;

        // Hide wallet options dropdown
        walletOptions.style.display = "none";
      } else {
        console.error("Failed to retrieve wallet public key.");
      }
    } catch (err) {
      console.error("Error connecting wallet:", err);
    }
  }

  // Event listener for wallet buttons
  const walletOptionsList = document.querySelectorAll('.wallet-option');
  walletOptionsList.forEach((option) => {
    option.addEventListener('click', (event) => {
      const walletType = event.target.innerText;
      connectWallet(walletType);
    });
  });

  // Show the cooperation modal when the mint button is clicked
  if (mintButton) {
    mintButton.addEventListener("click", () => {
      if (cooperationModal) {
        cooperationModal.style.display = 'block';
      } else {
        console.error("Cooperation modal not found");
      }
    });
  }

  // Handle cooperation decision
  function handleCooperation(decision) {
    cooperationModal.style.display = 'none';  // Close modal
    startMinting(decision);
  }

  // Start minting process with video and decision
  async function startMinting(cooperate) {
    // Show the minting video when the decision is made
    blenderVideo.style.display = "block";
    blenderVideo.play();

    // Hide the mint button while the video plays
    if (mintButton) {
      mintButton.style.display = "none";
    }

    // Randomly decide the contract's action (cooperate or steal)
    const contractDecision = Math.random() > 0.5 ? 'cooperate' : 'steal';

    // Outcome determination based on cooperation/steal
    let outcome = '';

    if (cooperate === 'steal' && contractDecision === 'steal') {
      outcome = 'Try again';
    } else if (cooperate === 'cooperate' && contractDecision === 'cooperate') {
      outcome = '1 smoothie minted';
    } else if (cooperate === 'steal' && contractDecision === 'cooperate') {
      outcome = '2 smoothies minted';
    } else if (cooperate === 'cooperate' && contractDecision === 'steal') {
      outcome = '1 SMEWTH token minted';
    }

    // After a 3-second delay (simulating minting), hide video and show result
    setTimeout(() => {
      blenderVideo.style.display = "none"; // Hide the video
      if (mintButton) {
        mintButton.style.display = "block"; // Show mint button again
      }
      outcomeMessage.innerText = outcome; // Display the outcome
      if (outcomeModal) {
        outcomeModal.style.display = "block"; // Show outcome modal
      }

      updateTracker(outcome);  // Update tracker UI with new stats
    }, 3000); // Adjust this duration based on your video length
  }

  // Close the outcome modal when the user clicks the Close button
  if (closeOutcomeModal) {
    closeOutcomeModal.addEventListener("click", () => {
      if (outcomeModal) {
        outcomeModal.style.display = "none";
      }
    });
  }

  // Event listeners for the cooperation buttons
  if (cooperateButton) {
    cooperateButton.addEventListener('click', () => {
      handleCooperation('cooperate');
    });
  }

  if (stealButton) {
    stealButton.addEventListener('click', () => {
      handleCooperation('steal');
    });
  }

  // Toggle explanation pop-up
  wtfButton.addEventListener('click', () => {
    explanationPopup.style.display = explanationPopup.style.display === 'block' ? 'none' : 'block';
  });

  // Toggle tracker pop-up
  trackerButton.addEventListener('click', () => {
    trackerPopup.style.display = trackerPopup.style.display === 'block' ? 'none' : 'block';
  });

  // Close the explanation pop-up
  closeExplanationPopup.addEventListener('click', () => {
    explanationPopup.style.display = 'none';
  });

  // Close the tracker pop-up
  closeTrackerPopup.addEventListener('click', () => {
    trackerPopup.style.display = 'none';
  });

  // Close the pop-ups when clicking outside
  document.addEventListener('click', (event) => {
    if (!explanationPopup.contains(event.target) && !wtfButton.contains(event.target)) {
      explanationPopup.style.display = 'none';
    }
    if (!trackerPopup.contains(event.target) && !trackerButton.contains(event.target)) {
      trackerPopup.style.display = 'none';
    }

    // Close the outcome modal if clicked outside
    if (outcomeModal && !outcomeModal.contains(event.target) && outcomeModal.style.display === 'block') {
      outcomeModal.style.display = "none";
    }
  });

  // Initialize the tracker on page load
  initializeTracker();

  // Reset wallet connection on page refresh
  connectWalletButton.textContent = "Connect Wallet";
};

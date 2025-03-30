let nodeActive = false;
let totalUptime = 0;
let edgeBalance = 0; // Track $EDGE balance
let uptimeInterval;

// Load saved state
chrome.storage.local.get(['nodeActive', 'totalUptime', 'edgeBalance'], (data) => {
  nodeActive = data.nodeActive || false;
  totalUptime = data.totalUptime || 0;
  edgeBalance = data.edgeBalance || 0;
  updateUI();

  // Only start the uptime counter if the node is active
  if (nodeActive) {
    startUptimeCounter();
  }
});

// Update the UI
function updateUI() {
  const nodeStatus = document.getElementById('nodeStatus');
  const toggleButton = document.getElementById('toggleButton');
  const loader = document.querySelector('.giftbox');
  const uptimeDisplay = document.getElementById('uptime');
  const earningsDisplay = document.getElementById('earnings');

  nodeStatus.textContent = nodeActive ? 'Online' : 'Offline';
  toggleButton.textContent = nodeActive ? 'Stop Node' : 'Start Node';
  uptimeDisplay.textContent = totalUptime;
  earningsDisplay.textContent = edgeBalance;

  // Control loader animation
  if (nodeActive) {
    loader.style.animationPlayState = 'running'; // Start animation
  } else {
    loader.style.animationPlayState = 'paused'; // Pause animation
  }
}

// Start the uptime counter
function startUptimeCounter() {
  uptimeInterval = setInterval(() => {
    if (totalUptime >= 20) { // 12 hours in seconds (simulated as 20 seconds for testing)
      edgeBalance += 10; // Increment $EDGE balance by 10
      totalUptime = 0; // Reset uptime
      saveNodeState({ nodeActive, totalUptime, edgeBalance }); // Save new balance and reset uptime
    }
    totalUptime++;
    saveNodeState({ totalUptime, edgeBalance });
    updateUI();
  }, 1000);
}

// Toggle node on/off
document.getElementById('toggleButton').addEventListener('click', async () => {
  nodeActive = !nodeActive;

  if (nodeActive) {
    startUptimeCounter(); // Start the counter when the node is turned on
  } else {
    clearInterval(uptimeInterval); // Stop the counter when the node is turned off
  }

  // Save state
  await saveNodeState({ nodeActive, totalUptime, edgeBalance });
  updateUI();
});

// Save node state
const saveNodeState = async (state) => {
  return new Promise((resolve) => {
    chrome.storage.local.set(state, () => resolve());
  });
};

// Toggle navbar
document.getElementById('navToggle').addEventListener('click', () => {
  const navLinks = document.getElementById('navLinks');
  navLinks.classList.toggle('active');
});
let nodeActive = false;
let totalUptime = 0;
let pointsBalance = 0; // Changed from edgeBalance to pointsBalance
let uptimeInterval;

// Load saved state
chrome.storage.local.get(['nodeActive', 'totalUptime', 'pointsBalance'], (data) => {
  nodeActive = data.nodeActive || false;
  totalUptime = data.totalUptime || 0;
  pointsBalance = data.pointsBalance || 0;
  updateUI();

  if (nodeActive) {
    startUptimeCounter();
  }
});

function updateUI() {
  const nodeStatus = document.getElementById('nodeStatus');
  const toggleButton = document.getElementById('toggleButton');
  const loader = document.querySelector('.giftbox');
  const uptimeDisplay = document.getElementById('uptime');
  const pointsDisplay = document.getElementById('points');

  nodeStatus.textContent = nodeActive ? 'Online' : 'Offline';
  toggleButton.textContent = nodeActive ? 'Stop Node' : 'Start Node';
  uptimeDisplay.textContent = totalUptime;
  pointsDisplay.textContent = pointsBalance;

  if (nodeActive) {
    loader.style.animationPlayState = 'running';
  } else {
    loader.style.animationPlayState = 'paused';
  }
}

function startUptimeCounter() {
  uptimeInterval = setInterval(() => {
    totalUptime++;
    pointsBalance = Math.floor(totalUptime / 60); // 1 point per minute
    saveNodeState({ nodeActive, totalUptime, pointsBalance });
    updateUI();
  }, 1000); // Update every second
}

document.getElementById('toggleButton').addEventListener('click', async () => {
  nodeActive = !nodeActive;

  if (nodeActive) {
    startUptimeCounter();
  } else {
    clearInterval(uptimeInterval);
  }

  await saveNodeState({ nodeActive, totalUptime, pointsBalance });
  updateUI();
});

const saveNodeState = async (state) => {
  return new Promise((resolve) => {
    chrome.storage.local.set(state, () => resolve());
  });
};

// Set cookie when node is active
function setSessionCookie() {
  const cookieDetails = {
    url: "http://localhost:5000",
    name: "nodeSession",
    value: "active",
    expirationDate: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 // 30 days
  };
  chrome.cookies.set(cookieDetails);
}

// Remove cookie when node is inactive
function removeSessionCookie() {
  chrome.cookies.remove({
    url: "http://localhost:5000",
    name: "nodeSession"
  });
}

// Update cookie when node status changes
chrome.storage.onChanged.addListener((changes) => {
  if (changes.nodeActive) {
    if (changes.nodeActive.newValue) {
      setSessionCookie();
    } else {
      removeSessionCookie();
    }
  }
});
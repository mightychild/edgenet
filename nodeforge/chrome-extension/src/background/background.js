// Listen for messages from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'SEND_EXTENSION_DATA') {
      const { token, nodeActive, totalUptime, edgeBalance } = request.data;
  
      // Send data to the backend
      fetch('http://localhost:5000/api/points/extension-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nodeActive, totalUptime, edgeBalance }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Data sent to backend:', data);
          sendResponse(data);
        })
        .catch((error) => {
          console.error('Error sending data to backend:', error);
          sendResponse({ error: 'Failed to send data' });
        });
  
      return true; // Required for async response
    }
  });
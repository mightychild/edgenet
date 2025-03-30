document.addEventListener('DOMContentLoaded', async () => {
    // Fetch referral data from the backend
    const token = await new Promise((resolve) => {
      chrome.storage.local.get('token', (data) => resolve(data.token));
    });
  
    if (!token) {
      window.location.href = 'login.html'; // Redirect to login if no token
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/referral', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Display the referral link
        document.getElementById('referral-link').value = data.referralLink;
  
        // Add copy functionality
        document.getElementById('copy-button').addEventListener('click', () => {
          navigator.clipboard.writeText(data.referralLink).then(() => {
            alert('Referral link copied to clipboard!');
          });
        });
      } else {
        alert('Failed to fetch referral data');
      }
    } catch (error) {
      console.error('Error fetching referral data:', error);
    }
});
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Save the token in Chrome storage
        chrome.storage.local.set({ token: data.token }, () => {
          // Redirect to the popup page after successful login
          window.location.href = 'popup.html';
        });
      } else {
        document.getElementById('error-message').textContent = data.error || 'Login failed';
      }
    } catch (error) {
      document.getElementById('error-message').textContent = 'An error occurred. Please try again.';
    }
  });
  
  // Google Login
  document.getElementById('google-login-button').addEventListener('click', async () => {
    try {
      // Open Google OAuth consent screen
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?
        client_id=${encodeURIComponent(process.env.GOOGLE_CLIENT_ID)}&
        redirect_uri=${encodeURIComponent('http://localhost:5000/api/auth/google/callback')}&
        response_type=code&
        scope=email profile&
        access_type=offline`;
  
      // Open a new tab for Google OAuth
      chrome.tabs.create({ url: authUrl });
    } catch (error) {
      console.error('Google Login failed:', error);
      document.getElementById('error-message').textContent = 'Google Login failed. Please try again.';
    }
});
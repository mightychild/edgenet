// Save node state to Chrome's local storage
export const saveNodeState = async (state) => {
    return new Promise((resolve) => {
      chrome.storage.local.set(state, () => {
        console.log('Node state saved:', state);
        resolve();
      });
    });
  };
  
  // Get node state from Chrome's local storage
  export const getNodeState = async () => {
    return new Promise((resolve) => {
      chrome.storage.local.get(['nodeActive', 'totalUptime'], (state) => {
        console.log('Node state retrieved:', state);
        resolve(state);
      });
    });
  };
  
  // Clear node state from Chrome's local storage
  export const clearNodeState = async () => {
    return new Promise((resolve) => {
      chrome.storage.local.remove(['nodeActive', 'totalUptime'], () => {
        console.log('Node state cleared');
        resolve();
      });
    });
  };
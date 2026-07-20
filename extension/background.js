/* global chrome */
let nativePort = null;

// Listen for connections from the extension pages (main tab)
chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== 'chouette-ui') return;

  console.log('[SW] UI connected to background service worker');

  // Attempt to connect to the native companion host
  try {
    nativePort = chrome.runtime.connectNative('com.chouette.gpt.companion');
    
    nativePort.onMessage.addListener((msg) => {
      // Forward messages from native host to UI
      port.postMessage(msg);
    });

    nativePort.onDisconnect.addListener(() => {
      const err = chrome.runtime.lastError;
      console.warn('[SW] Native host disconnected:', err ? err.message : 'No error message');
      port.postMessage({ 
        type: 'status', 
        status: 'error', 
        error: 'Companion disconnected or not installed. Please ensure the companion app is registered.' 
      });
      nativePort = null;
    });
  } catch (err) {
    console.error('[SW] Failed to connect to native host:', err);
    port.postMessage({ 
      type: 'status', 
      status: 'error', 
      error: 'Failed to connect to native companion' 
    });
  }

  // Listen for messages from UI and forward to native host
  port.onMessage.addListener((msg) => {
    if (nativePort) {
      try {
        nativePort.postMessage(msg);
      } catch (e) {
        console.error('[SW] Failed to post message to native host:', e.message);
        port.postMessage({ type: 'status', status: 'error', error: 'Error sending command to companion' });
      }
    } else {
      port.postMessage({ type: 'status', status: 'error', error: 'Native host not connected' });
    }
  });

  port.onDisconnect.addListener(() => {
    console.log('[SW] UI disconnected');
    if (nativePort) {
      nativePort.disconnect();
      nativePort = null;
    }
  });
});

// Open main interface tab on action click (extension icon click)
chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL('dist/index.html') });
});

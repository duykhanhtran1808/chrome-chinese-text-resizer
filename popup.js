document.addEventListener('DOMContentLoaded', function() {
  const textSizeInput = document.getElementById('text-size');
  const minusBtn = document.getElementById('minus-btn');
  const plusBtn = document.getElementById('plus-btn');
  const applyBtn = document.getElementById('apply-btn');
  const sampleText = document.getElementById('sample');
  
  // Load saved text size from storage
  chrome.storage.sync.get(['chineseTextSize'], function(result) {
    if (result.chineseTextSize) {
      textSizeInput.value = result.chineseTextSize;
      sampleText.style.fontSize = result.chineseTextSize + 'px';
    }
  });
  
  // Update sample text when input changes
  textSizeInput.addEventListener('input', function() {
    sampleText.style.fontSize = this.value + 'px';
  });
  
  // Minus button (decrease by 5px)
  minusBtn.addEventListener('click', function() {
    let currentSize = parseInt(textSizeInput.value);
    if (currentSize > 8) {
      currentSize -= 5;
      textSizeInput.value = currentSize;
      sampleText.style.fontSize = currentSize + 'px';
    }
  });
  
  // Plus button (increase by 5px)
  plusBtn.addEventListener('click', function() {
    let currentSize = parseInt(textSizeInput.value);
    currentSize += 5;
    textSizeInput.value = currentSize;
    sampleText.style.fontSize = currentSize + 'px';
  });
  
  // Apply button
  applyBtn.addEventListener('click', function() {
    const size = parseInt(textSizeInput.value);
    
    // Save the size to Chrome storage
    chrome.storage.sync.set({chineseTextSize: size}, function() {
      
      // Apply the size to the current tab
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.scripting.executeScript({
          target: {tabId: tabs[0].id},
          function: updateChineseText,
          args: [size]
        });
      });
    });
  });
});

// Function to pass to content script
function updateChineseText(size) {
  // Send a direct message to the content script to force update
  document.dispatchEvent(new CustomEvent('chinese-text-resize', { 
    detail: { fontSize: size } 
  }));
  
  // Also update storage to ensure persistence
  chrome.storage.sync.set({chineseTextSize: size});
} 
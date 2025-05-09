// Function to check if a text node contains Chinese characters
function containsChineseCharacters(text) {
  return /[\u4e00-\u9fff]/.test(text);
}

// Function to resize Chinese text in an element
function resizeChineseText(element, fontSize) {
  if (element.nodeType === Node.TEXT_NODE) {
    if (containsChineseCharacters(element.nodeValue)) {
      // Skip if parent is an input element or form control
      const parent = element.parentNode;
      if (parent && (
          parent.tagName === 'INPUT' || 
          parent.tagName === 'TEXTAREA' || 
          parent.tagName === 'SELECT' ||
          parent.contentEditable === 'true' ||
          parent.isContentEditable
      )) {
        return;
      }

      // If the parent is already styled by us, don't apply again
      if (parent && !parent.hasAttribute('data-chinese-text-resizer')) {
        const span = document.createElement('span');
        span.setAttribute('data-chinese-text-resizer', 'true');
        span.style.fontSize = fontSize + 'px';
        parent.replaceChild(span, element);
        span.appendChild(element);
      }
    }
  } else if (element.nodeType === Node.ELEMENT_NODE) {
    // Skip elements we've already processed or that shouldn't be modified
    if (element.hasAttribute('data-chinese-text-resizer') || 
        element.tagName === 'SCRIPT' || 
        element.tagName === 'STYLE' ||
        element.tagName === 'INPUT' ||
        element.tagName === 'TEXTAREA' ||
        element.tagName === 'SELECT' ||
        element.contentEditable === 'true' ||
        element.isContentEditable) {
      return;
    }
    
    // Process child nodes
    Array.from(element.childNodes).forEach(child => {
      resizeChineseText(child, fontSize);
    });
  }
}

// Function to clear previous styling and apply new size
function updateTextSize(fontSize) {
  
  // Remove existing styled elements
  document.querySelectorAll('[data-chinese-text-resizer]').forEach(el => {
    // Replace the span with its content
    if (el.tagName === 'SPAN') {
      const parent = el.parentNode;
      while (el.firstChild) {
        parent.insertBefore(el.firstChild, el);
      }
      parent.removeChild(el);
    }
  });
  
  // Apply the new size
  resizeChineseText(document.body, fontSize);
}

// Function to apply text size from storage
function applyTextSize() {
  chrome.storage.sync.get(['chineseTextSize'], function(result) {
    if (result.chineseTextSize) {
      const fontSize = result.chineseTextSize;
      resizeChineseText(document.body, fontSize);
      
      // Set up a mutation observer to handle dynamically added content
      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            resizeChineseText(node, fontSize);
          });
        });
      });
      
      observer.observe(document.body, { 
        childList: true, 
        subtree: true 
      });
    }
  });
}

// Initial application
applyTextSize();

// Listen for changes to the text size from storage
chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (namespace === 'sync' && changes.chineseTextSize) {
    updateTextSize(changes.chineseTextSize.newValue);
  }
});

// Listen for direct custom event from the popup script
document.addEventListener('chinese-text-resize', function(event) {
  updateTextSize(event.detail.fontSize);
}); 